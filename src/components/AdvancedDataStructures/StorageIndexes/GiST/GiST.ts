import { AppliedModel } from '../../../../visualization/AppliedModel.ts'
import type { AppliedDiagram, DiagramItem } from '../../../../visualization/AppliedModel.ts'
import { LinearModel } from '../../../../visualization/LinearModel.ts'
import type { LinearInputValues, LinearObserver, LinearResult } from '../../../../visualization/LinearModel.ts'
import type { ActionKind } from '../../../../visualization/ActionCatalog.ts'

export interface IntervalKey {
  readonly minimum: number
  readonly maximum: number
}

// An operator-class boundary, rather than hard-coded comparisons in the index.
export abstract class GiSTStrategy {
  public abstract union(keys: readonly IntervalKey[]): IntervalKey
  public abstract consistent(key: IntervalKey, query: IntervalKey): boolean
  public abstract penalty(key: IntervalKey, incoming: IntervalKey): number
  public abstract pickSplit(keys: readonly IntervalKey[]): readonly number[]
}

export class IntervalGiSTStrategy extends GiSTStrategy {
  public union(keys: readonly IntervalKey[]): IntervalKey {
    return { minimum: Math.min(...keys.map((key) => key.minimum)), maximum: Math.max(...keys.map((key) => key.maximum)) }
  }
  public consistent(key: IntervalKey, query: IntervalKey): boolean { return key.minimum <= query.maximum && query.minimum <= key.maximum }
  public penalty(key: IntervalKey, incoming: IntervalKey): number {
    const combined = this.union([key, incoming])
    return combined.maximum - combined.minimum - (key.maximum - key.minimum)
  }
  public pickSplit(keys: readonly IntervalKey[]): readonly number[] {
    const indices = keys.map((_, index) => index)
    indices.sort((a, b) => keys[a].minimum - keys[b].minimum || keys[a].maximum - keys[b].maximum || a - b)
    return indices
  }
}

interface GiSTEntry {
  key: IntervalKey
  child?: GiSTPage
  recordId?: number
}

interface GiSTPage {
  readonly id: number
  readonly leaf: boolean
  entries: GiSTEntry[]
}

export class GiST extends AppliedModel {
  public readonly kind = 'gist'
  public readonly representation = 'Balanced capacity-four GiST pages using an interval operator class: union bounds, overlap consistency, enlargement penalty, and median pick-split. This sequential teaching engine omits PostgreSQL locking, WAL, lossy data compression, and other operator classes.'
  private readonly strategy: GiSTStrategy
  private root: GiSTPage
  private nextPage = 2
  private nextRecord = 1
  private count = 0
  public get length(): number { return this.count }
  constructor(strategy: GiSTStrategy = new IntervalGiSTStrategy()) {
    super()
    this.strategy = strategy
    this.root = { id: 1, leaf: true, entries: [] }
  }
  public static createDefault(): GiST {
    const model = new GiST()
    for (let index = 0; index < 10; index += 1) model.execute('insert', { minimum: index * 10, maximum: index * 10 + 14 })
    return model
  }
  public clone(): GiST {
    const copy = new GiST(this.strategy)
    const clonePage = (page: GiSTPage): GiSTPage => ({ id: page.id, leaf: page.leaf, entries: page.entries.map((entry) => ({ key: { ...entry.key }, recordId: entry.recordId, child: entry.child ? clonePage(entry.child) : undefined })) })
    copy.root = clonePage(this.root)
    copy.nextPage = this.nextPage
    copy.nextRecord = this.nextRecord
    copy.count = this.count
    return copy
  }
  public getDiagram(): AppliedDiagram {
    const rows: DiagramItem[][] = []
    const visit = (page: GiSTPage, depth: number): void => {
      rows[depth] ??= []
      const key = page.entries.length ? this.strategy.union(page.entries.map((entry) => entry.key)) : null
      rows[depth].push({ id: `gist-page-${page.id}`, text: key ? `[${key.minimum}, ${key.maximum}]` : 'empty', label: `${page.leaf ? 'leaf' : 'internal'} page ${page.id} / ${page.entries.length}/4`, children: page.entries.map((entry) => entry.child ? `gist-page-${entry.child.id}` : `gist-record-${entry.recordId}`) })
      for (const entry of page.entries) {
        if (entry.child) visit(entry.child, depth + 1)
        else {
          rows[depth + 1] ??= []
          rows[depth + 1].push({ id: `gist-record-${entry.recordId}`, text: `[${entry.key.minimum}, ${entry.key.maximum}]`, label: `record ${entry.recordId}` })
        }
      }
    }
    visit(this.root, 0)
    return { rows }
  }
  private insert(page: GiSTPage, entry: GiSTEntry, observer: LinearObserver | undefined, splits: number[]): GiSTPage | null {
    if (page.leaf) page.entries.push(entry)
    else {
      let selected = page.entries[0]
      for (const candidate of page.entries) {
        if (this.strategy.penalty(candidate.key, entry.key) < this.strategy.penalty(selected.key, entry.key)) selected = candidate
      }
      // No structural writes have occurred on this path yet.
      if (splits.length === 0) LinearModel.emit(observer, `gist-page-${selected.child!.id}`, 'Choose the child with minimum operator-class enlargement.', 'child = minimum penalty(bounds, incoming)')
      const sibling = this.insert(selected.child!, entry, observer, splits)
      selected.key = this.strategy.union(selected.child!.entries.map((item) => item.key))
      if (sibling) page.entries.push({ key: this.strategy.union(sibling.entries.map((item) => item.key)), child: sibling })
    }
    if (page.entries.length <= 4) return null
    const order = this.strategy.pickSplit(page.entries.map((item) => item.key))
    const entries = page.entries
    page.entries = order.slice(0, 2).map((index) => entries[index])
    const sibling: GiSTPage = { id: this.nextPage++, leaf: page.leaf, entries: order.slice(2).map((index) => entries[index]) }
    splits.push(page.id)
    return sibling
  }
  public execute(action: ActionKind, input: LinearInputValues, observer?: LinearObserver): LinearResult {
    if (action === 'inspect-storage') return this.inspect(observer)
    if (action === 'clear') {
      this.root = { id: this.nextPage++, leaf: true, entries: [] }
      this.count = 0
      return { description: 'Released GiST pages and records; retained the operator class and ID counters.' }
    }
    const query = { minimum: AppliedModel.bounded(input, 'minimum', -1024, 1024), maximum: AppliedModel.bounded(input, 'maximum', -1024, 1024) }
    if (query.minimum > query.maximum) throw new RangeError('Maximum must be at least minimum')
    if (action === 'insert') {
      if (this.count === 64) return this.reject('At most 64 interval records are supported.')
      const recordId = this.nextRecord++
      const splits: number[] = []
      const sibling = this.insert(this.root, { key: query, recordId }, observer, splits)
      if (sibling) this.root = { id: this.nextPage++, leaf: false, entries: [this.root, sibling].map((child) => ({ child, key: this.strategy.union(child.entries.map((item) => item.key)) })) }
      this.count += 1
      LinearModel.emit(observer, `gist-record-${recordId}`, `Inserted record ${recordId}; split ${splits.length} overflowing pages and published all union bounds.`, 'pickSplit overflowing pages; publish consistent root', 'NEW')
      return { description: `Stored interval [${query.minimum}, ${query.maximum}] as record ${recordId}.`, activeId: `gist-record-${recordId}` }
    }
    if (action !== 'search-overlap') throw new RangeError('Unsupported GiST action')
    const matches: number[] = []
    const visit = (page: GiSTPage): void => {
      LinearModel.emit(observer, `gist-page-${page.id}`, 'Evaluate consistency against each entry in this page.', 'if consistent(entry.key, query): descend or recheck leaf')
      for (const entry of page.entries) {
        if (!this.strategy.consistent(entry.key, query)) continue
        if (entry.child) visit(entry.child)
        else {
          matches.push(entry.recordId!)
          LinearModel.emit(observer, `gist-record-${entry.recordId}`, 'The exact leaf interval overlaps the query.', 'emit matching record')
        }
      }
    }
    visit(this.root)
    return { description: `Overlapping record IDs: [${matches.join(', ')}].`, value: matches, status: matches.length ? 'FOUND' : 'ABSENT' }
  }
}
