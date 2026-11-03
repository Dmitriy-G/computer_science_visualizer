import { AppliedModel } from '../../../../visualization/AppliedModel.ts'
import type { AppliedDiagram, DiagramItem } from '../../../../visualization/AppliedModel.ts'
import { LinearModel } from '../../../../visualization/LinearModel.ts'
import type { LinearInputValues, LinearObserver, LinearResult } from '../../../../visualization/LinearModel.ts'
import type { ActionKind } from '../../../../visualization/ActionCatalog.ts'

export interface Minimizer {
  readonly key: number
  readonly position: number
}

export class MinimizerIndex extends AppliedModel {
  public readonly kind = 'minimizer-index'
  public readonly representation = 'Forward DNA 3-mers use exact two-bit codes. A monotone deque selects the rightmost minimum in each three-k-mer window; a hash map stores deduplicated reference positions. Queries gather seed anchors then verify complete exact matches. This excludes reverse complements, chaining, and alignment scoring from minimap2.'
  public readonly countLabel = 'reference bases'
  private reference = ''
  private postings = new Map<number, number[]>()
  public get length(): number { return this.reference.length }
  public static createDefault(): MinimizerIndex {
    const model = new MinimizerIndex()
    model.execute('build-text', { text: 'acgttgcagt' })
    return model
  }
  public static minimizers(text: string): Minimizer[] {
    const bases = 'acgt'
    const kmers: Minimizer[] = []
    let rolling = 0
    for (let index = 0; index < text.length; index += 1) {
      rolling = ((rolling << 2) | bases.indexOf(text[index])) & 63
      if (index >= 2) kmers.push({ key: rolling, position: index - 2 })
    }
    const deque: number[] = []
    let head = 0
    const result: Minimizer[] = []
    for (let index = 0; index < kmers.length; index += 1) {
      while (head < deque.length && deque[head] <= index - 3) head += 1
      while (deque.length > head && kmers[deque[deque.length - 1]].key >= kmers[index].key) deque.pop()
      deque.push(index)
      if (index >= 2) {
        const minimum = kmers[deque[head]]
        if (result[result.length - 1]?.position !== minimum.position) result.push(minimum)
      }
    }
    return result
  }
  public clone(): MinimizerIndex {
    const copy = new MinimizerIndex()
    copy.reference = this.reference
    for (const [key, positions] of this.postings) copy.postings.set(key, [...positions])
    return copy
  }
  public getDiagram(): AppliedDiagram {
    const rows: DiagramItem[][] = [Array.from(this.reference, (base, index) => ({ id: `min-base-${index}`, text: base, label: `reference ${index}` }))]
    const keys: DiagramItem[] = []
    rows.push(keys)
    for (const key of [...this.postings.keys()].sort((a, b) => a - b)) {
      const positions = this.postings.get(key)!
      keys.push({ id: `min-key-${key}`, text: key.toString(2).padStart(6, '0'), label: `3-mer code ${key}`, children: positions.map((position) => `min-pos-${key}-${position}`) })
      rows.push(positions.map((position) => ({ id: `min-pos-${key}-${position}`, text: String(position), label: `code ${key} / reference offset` })))
    }
    return { rows }
  }
  public execute(action: ActionKind, input: LinearInputValues, observer?: LinearObserver): LinearResult {
    if (action === 'inspect-storage') return this.inspect(observer)
    if (action === 'clear') {
      this.reference = ''
      this.postings.clear()
      return { description: 'Released the DNA reference and minimizer postings.' }
    }
    const text = AppliedModel.dna(input, 5, action === 'build-text' ? 64 : 32)
    const seeds = MinimizerIndex.minimizers(text)
    if (action === 'build-text') {
      this.reference = text
      this.postings = new Map()
      for (const seed of seeds) {
        const positions = this.postings.get(seed.key) ?? []
        positions.push(seed.position)
        this.postings.set(seed.key, positions)
        LinearModel.emit(observer, `min-pos-${seed.key}-${seed.position}`, `Select minimizer code ${seed.key} at reference position ${seed.position}.`, 'maintain monotone deque; append selected position', 'NEW')
      }
      return { description: `Indexed ${seeds.length} selected minimizer positions from ${text.length} bases.` }
    }
    if (action !== 'search-text') throw new RangeError('Unsupported minimizer action')
    const candidates = new Set<number>()
    for (const seed of seeds) {
      const positions = this.postings.get(seed.key) ?? []
      if (positions.length) LinearModel.emit(observer, `min-key-${seed.key}`, `Look up query minimizer ${seed.key}.`, 'candidateStart = referencePosition - queryPosition')
      for (const position of positions) if (position >= seed.position) candidates.add(position - seed.position)
    }
    const matches: number[] = []
    for (const start of [...candidates].sort((a, b) => a - b)) {
      if (start >= this.length) continue
      LinearModel.emit(observer, `min-base-${start}`, `Verify the entire query at candidate start ${start}.`, 'compare reference substring with query')
      if (this.reference.startsWith(text, start)) matches.push(start)
    }
    return { description: `Exact query matches start at [${matches.join(', ')}]. Seed matches alone do not establish an alignment.`, value: matches, status: matches.length ? 'FOUND' : 'ABSENT' }
  }
}
