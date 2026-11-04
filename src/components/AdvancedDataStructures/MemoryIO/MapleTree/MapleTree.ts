import { AppliedModel } from '../../../../visualization/AppliedModel.ts'
import type { AppliedDiagram, DiagramItem } from '../../../../visualization/AppliedModel.ts'
import { LinearModel } from '../../../../visualization/LinearModel.ts'
import type { LinearInputValues, LinearObserver, LinearResult } from '../../../../visualization/LinearModel.ts'
import type { ActionKind } from '../../../../visualization/ActionCatalog.ts'

interface MapleRange {
  readonly id: number
  readonly minimum: number
  readonly maximum: number
  readonly value: number
}

interface MapleNode {
  readonly id: string
  readonly maximum: number
  readonly ranges: readonly MapleRange[]
  readonly children: readonly MapleNode[]
}

export class MapleTree extends AppliedModel {
  public readonly kind = 'maple-tree'
  public readonly representation = 'Nonoverlapping inclusive ranges in a fanout-four pivot tree over 0..4095. Store replaces overlapping values and erase can split ranges. This Maple-inspired teaching variant bulk-rebuilds pages after edits, scans ranges for gaps, and has no RCU or native Maple node encodings.'
  public readonly countLabel = 'ranges'
  private ranges: MapleRange[] = []
  private root: MapleNode | null = null
  private nextId = 1
  public get length(): number { return this.ranges.length }
  public static createDefault(): MapleTree {
    const model = new MapleTree()
    for (let index = 0; index < 10; index += 1) model.execute('insert', { minimum: index * 20, maximum: index * 20 + 9, value: index + 1 })
    return model
  }
  public clone(): MapleTree {
    const copy = new MapleTree()
    copy.ranges = [...this.ranges]
    copy.root = this.root
    copy.nextId = this.nextId
    return copy
  }
  private rebuild(): void {
    let nodes: MapleNode[] = []
    for (let offset = 0; offset < this.length; offset += 4) {
      const ranges = this.ranges.slice(offset, offset + 4)
      nodes.push({ id: `maple-leaf-${ranges.map((range) => range.id).join('-')}`, maximum: ranges[ranges.length - 1].maximum, ranges, children: [] })
    }
    let depth = 0
    while (nodes.length > 1) {
      const parents: MapleNode[] = []
      for (let offset = 0; offset < nodes.length; offset += 4) {
        const children = nodes.slice(offset, offset + 4)
        parents.push({ id: `maple-page-${depth}-${children[0].id}`, maximum: children[children.length - 1].maximum, ranges: [], children })
      }
      nodes = parents
      depth += 1
    }
    this.root = nodes[0] ?? null
  }
  public getDiagram(): AppliedDiagram {
    const rows: DiagramItem[][] = []
    const visit = (node: MapleNode, depth: number): void => {
      rows[depth] ??= []
      rows[depth].push({ id: node.id, text: node.children.length ? node.children.map((child) => child.maximum).join(' | ') : `upper ${node.maximum}`, label: node.children.length ? 'inclusive child pivots' : `leaf / ${node.ranges.length}/4`, children: node.children.length ? node.children.map((child) => child.id) : node.ranges.map((range) => `maple-range-${range.id}`) })
      for (const child of node.children) visit(child, depth + 1)
      if (node.ranges.length) {
        rows[depth + 1] ??= []
        for (const range of node.ranges) rows[depth + 1].push({ id: `maple-range-${range.id}`, text: String(range.value), label: `[${range.minimum}, ${range.maximum}]` })
      }
    }
    if (this.root) visit(this.root, 0)
    return { rows }
  }
  public execute(action: ActionKind, input: LinearInputValues, observer?: LinearObserver): LinearResult {
    if (action === 'inspect-storage') return this.inspect(observer)
    if (action === 'clear') {
      this.ranges = []
      this.root = null
      return { description: 'Released all ranges and pivot pages.' }
    }
    if (action === 'search-index') {
      const index = AppliedModel.bounded(input, 'index', 0, 4095)
      let node = this.root
      while (node) {
        LinearModel.emit(observer, node.id, `Choose the first inclusive pivot covering ${index}.`, 'child = first pivot >= index')
        if (!node.children.length) break
        node = node.children.find((child) => child.maximum >= index) ?? null
      }
      const range = node?.ranges.find((entry) => entry.minimum <= index && index <= entry.maximum)
      return { description: range ? `Index ${index} maps to ${range.value} in [${range.minimum}, ${range.maximum}].` : `Index ${index} is a gap.`, value: range?.value ?? null, activeId: range ? `maple-range-${range.id}` : null, status: range ? 'FOUND' : 'GAP' }
    }
    if (action === 'find-gap') {
      const size = AppliedModel.bounded(input, 'count', 1, 4096)
      let start = 0
      for (const range of this.ranges) {
        LinearModel.emit(observer, `maple-range-${range.id}`, `Check the gap before [${range.minimum}, ${range.maximum}].`, 'if range.minimum - start >= size: return start')
        if (range.minimum - start >= size) break
        start = range.maximum + 1
      }
      const found = start + size <= 4096
      return { description: found ? `First free range of length ${size}: [${start}, ${start + size - 1}].` : `No gap can hold ${size} indices.`, value: found ? start : null, status: found ? 'GAP FOUND' : 'ABSENT' }
    }
    const minimum = AppliedModel.bounded(input, 'minimum', 0, 4095)
    const maximum = AppliedModel.bounded(input, 'maximum', 0, 4095)
    if (minimum > maximum) throw new RangeError('Maximum must be at least minimum')
    const value = action === 'insert' ? LinearModel.integer(input, 'value') : 0
    if (action !== 'insert' && action !== 'delete-value') throw new RangeError('Unsupported Maple action')
    let nextId = this.nextId
    const ranges: MapleRange[] = []
    for (const range of this.ranges) {
      LinearModel.emit(observer, `maple-range-${range.id}`, 'Compare this range with the replacement interval.', 'retain disjoint range; split overlapping remainder')
      if (range.maximum < minimum || range.minimum > maximum) ranges.push(range)
      else {
        if (range.minimum < minimum) ranges.push({ ...range, maximum: minimum - 1 })
        if (range.maximum > maximum) ranges.push({ ...range, id: nextId++, minimum: maximum + 1 })
      }
    }
    if (action === 'insert') ranges.push({ id: nextId++, minimum, maximum, value })
    if (ranges.length > 64) return this.reject('The resulting range fragments exceed 64; all ranges and IDs are unchanged.')
    ranges.sort((a, b) => a.minimum - b.minimum)
    this.ranges = ranges
    this.nextId = nextId
    this.rebuild()
    return { description: `${action === 'insert' ? 'Stored' : 'Erased'} [${minimum}, ${maximum}]; rebuilt pivot pages over ${this.length} nonoverlapping ranges.` }
  }
}
