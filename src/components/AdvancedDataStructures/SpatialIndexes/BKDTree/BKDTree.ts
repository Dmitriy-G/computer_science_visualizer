import { AppliedModel } from '../../../../visualization/AppliedModel.ts'
import type { AppliedDiagram, DiagramItem } from '../../../../visualization/AppliedModel.ts'
import { LinearModel } from '../../../../visualization/LinearModel.ts'
import type { LinearInputValues, LinearObserver, LinearResult } from '../../../../visualization/LinearModel.ts'
import type { ActionKind } from '../../../../visualization/ActionCatalog.ts'
import { PointData } from '../../../../visualization/PointData.ts'
import type { PointEntry } from '../../../../visualization/PointData.ts'

interface BKDNode {
  readonly id: number
  readonly minX: number
  readonly minY: number
  readonly maxX: number
  readonly maxY: number
  readonly axis: 'x' | 'y'
  readonly points: readonly PointEntry[]
  readonly children: readonly BKDNode[]
}

export class BKDTree extends AppliedModel {
  public readonly kind = 'bkd-tree'
  public readonly representation = 'A bulk-built 2D block KD-tree with at most three points per leaf, widest-axis median splits, and bounding-box pruning. The build sorts each recursive partition; it does not implement Lucene codecs, disk blocks, or radix selection.'
  private root: BKDNode | null = null
  private points: PointEntry[] = []
  private nextId = 1
  private nextNode = 1
  public get length(): number { return this.points.length }
  public static createDefault(): BKDTree {
    const model = new BKDTree()
    model.points = PointData.defaults()
    model.nextId = 11
    model.root = model.build(model.points)
    return model
  }
  public clone(): BKDTree {
    const copy = new BKDTree()
    copy.points = [...this.points]
    copy.root = this.root
    copy.nextId = this.nextId
    copy.nextNode = this.nextNode
    return copy
  }
  private build(points: readonly PointEntry[]): BKDNode | null {
    if (!points.length) return null
    const minX = Math.min(...points.map((point) => point.x))
    const minY = Math.min(...points.map((point) => point.y))
    const maxX = Math.max(...points.map((point) => point.x))
    const maxY = Math.max(...points.map((point) => point.y))
    const axis = maxX - minX >= maxY - minY ? 'x' : 'y'
    const node: Omit<BKDNode, 'points' | 'children'> = { id: this.nextNode++, minX, minY, maxX, maxY, axis }
    if (points.length <= 3) return { ...node, points: [...points], children: [] }
    const sorted = [...points].sort((a, b) => a[axis] - b[axis] || a.id - b.id)
    const middle = Math.floor(sorted.length / 2)
    return { ...node, points: [], children: [this.build(sorted.slice(0, middle))!, this.build(sorted.slice(middle))!] }
  }
  public getDiagram(): AppliedDiagram {
    const rows: DiagramItem[][] = []
    const visit = (node: BKDNode, depth: number): void => {
      rows[depth] ??= []
      rows[depth].push({ id: `bkd-${node.id}`, text: `[${node.minX},${node.minY}]..[${node.maxX},${node.maxY}]`, label: node.points.length ? `leaf block / ${node.points.length}/3` : `${node.axis}-axis split`, children: node.children.length ? node.children.map((child) => `bkd-${child.id}`) : node.points.map((point) => `bkd-point-${point.id}`) })
      for (const child of node.children) visit(child, depth + 1)
      if (node.points.length) {
        rows[depth + 1] ??= []
        for (const point of node.points) rows[depth + 1].push({ id: `bkd-point-${point.id}`, text: `(${point.x}, ${point.y})`, label: `point ${point.id}` })
      }
    }
    if (this.root) visit(this.root, 0)
    return { rows }
  }
  public execute(action: ActionKind, input: LinearInputValues, observer?: LinearObserver): LinearResult {
    if (action === 'inspect-storage') return this.inspect(observer)
    if (action === 'clear') {
      this.root = null
      this.points = []
      return { description: 'Released the block KD-tree and point records.' }
    }
    if (action === 'build-values') {
      const parsed = PointData.parse(input.text)
      const points = parsed.map((point, index) => ({ ...point, id: this.nextId + index }))
      this.root = this.build(points)
      this.points = points
      this.nextId += points.length
      this.inspect(observer)
      return { description: `Built ${points.length} points into median-partitioned blocks of at most three.` }
    }
    if (action !== 'search-overlap') throw new RangeError('Unsupported BKD action')
    const minX = AppliedModel.bounded(input, 'minX', -1024, 1024)
    const minY = AppliedModel.bounded(input, 'minY', -1024, 1024)
    const maxX = AppliedModel.bounded(input, 'maxX', -1024, 1024)
    const maxY = AppliedModel.bounded(input, 'maxY', -1024, 1024)
    if (maxX < minX || maxY < minY) throw new RangeError('Maximum coordinates must be at least minimum coordinates')
    const matches: number[] = []
    const visit = (node: BKDNode): void => {
      const disjoint = node.maxX < minX || node.minX > maxX || node.maxY < minY || node.minY > maxY
      LinearModel.emit(observer, `bkd-${node.id}`, disjoint ? 'Prune this disjoint cell.' : 'This cell intersects the query; inspect children or leaf points.', 'if bounds intersect query: descend')
      if (disjoint) return
      for (const point of node.points) {
        LinearModel.emit(observer, `bkd-point-${point.id}`, `Recheck point ${point.id} against all four inclusive bounds.`, 'minX <= x <= maxX and minY <= y <= maxY')
        if (point.x >= minX && point.x <= maxX && point.y >= minY && point.y <= maxY) matches.push(point.id)
      }
      for (const child of node.children) visit(child)
    }
    if (this.root) visit(this.root)
    return { description: `Points inside the query: [${matches.join(', ')}].`, value: matches, status: matches.length ? 'FOUND' : 'ABSENT' }
  }
}
