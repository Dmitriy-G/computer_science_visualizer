import { ExtendedTreeModel } from './ExtendedTreeModel.ts'
import { AdditionalTreeModel } from '../../../visualization/AdditionalTreeModel.ts'
import type { TreeDiagramEntry, TreeInputValues, TreeOperationResult } from '../../../visualization/AdditionalTreeModel.ts'
import type { ActionKind } from '../../../visualization/ActionCatalog.ts'
import type { TreeTraceObserver } from '../../../visualization/TreeTrace.ts'
class OrthantNode {
  public points: number[][] = []
  public children = new Map<number, OrthantNode>()
  public readonly id: string
  public readonly low: readonly number[]
  public readonly high: readonly number[]
  public readonly depth: number
  constructor(id: string, low: readonly number[], high: readonly number[], depth: number) {
    this.id = id
    this.low = low
    this.high = high
    this.depth = depth
  }
}
// The actual shared orthant subdivision algorithm: four children in 2D, eight in 3D.
export abstract class OrthantTreeModel extends ExtendedTreeModel {
  protected abstract readonly dimensions: number
  protected abstract empty(): OrthantTreeModel
  private root: OrthantNode | null = null
  private count = 0
  public get length(): number { return this.count }
  public clone(): OrthantTreeModel {
    const copy = this.empty()
    const visit = (node: OrthantNode): OrthantNode => {
      const target = new OrthantNode(node.id, [...node.low], [...node.high], node.depth)
      for (const point of node.points) target.points.push([...point])
      for (const [index, child] of node.children) target.children.set(index, visit(child))
      return target
    }
    copy.root = this.root ? visit(this.root) : null
    copy.count = this.count
    copy.nextId = this.nextId
    return copy
  }
  public getDiagram(): TreeDiagramEntry[] {
    const result: TreeDiagramEntry[] = []
    const visit = (node: OrthantNode, role: string): void => {
      const children: string[] = []
      for (const child of node.children.values()) children.push(child.id)
      const text: string[] = []
      for (const point of node.points) text.push(`(${point.join(',')})`)
      result.push({ id: node.id, text: text.join(' ') || (children.length ? `${this.dimensions === 2 ? 'quad' : 'oct'} split` : 'empty'), label: `${role}; depth ${node.depth}`, children, width: Math.max(170, text.join(' ').length * 10 + 24) })
      for (const [index, child] of node.children) visit(child, `orthant ${index}`)
    }
    if (this.root) visit(this.root, '[-1024,1024) per axis')
    return result
  }
  private child(node: OrthantNode, point: readonly number[]): OrthantNode {
    const low: number[] = []
    const high: number[] = []
    let index = 0
    for (let axis = 0; axis < this.dimensions; axis += 1) {
      const mid = (node.low[axis] + node.high[axis]) / 2
      const upper = point[axis] >= mid
      if (upper) index += 2 ** axis
      low.push(upper ? mid : node.low[axis])
      high.push(upper ? node.high[axis] : mid)
    }
    let child = node.children.get(index)
    if (!child) {
      child = new OrthantNode(this.allocateId(), low, high, node.depth + 1)
      node.children.set(index, child)
    }
    return child
  }
  private insert(node: OrthantNode, point: number[], observer?: TreeTraceObserver): boolean {
    this.emit(observer, node.id, 'Select the orthant using midpoint comparisons on every axis.', 'orthant bits = point[axis] >= midpoint[axis]', 'compare')
    if (node.children.size) return this.insert(this.child(node, point), point, observer)
    for (const current of node.points) {
      let equal = true
      for (let axis = 0; axis < this.dimensions; axis += 1) if (current[axis] !== point[axis]) equal = false
      if (equal) return false
    }
    if (node.points.length < 2 || node.depth >= 11) {
      node.points.push(point)
      return true
    }
    const points = node.points
    node.points = []
    for (const current of points) this.insert(this.child(node, current), current)
    return this.insert(this.child(node, point), point)
  }
  public execute(action: ActionKind, input: TreeInputValues, observer?: TreeTraceObserver): TreeOperationResult {
    if (action === 'clear') {
      this.root = null
      this.count = 0
      this.emit(observer, null, 'Release all point buckets and subdivisions.', 'root = null', 'remove')
      return { description: 'All spatial points were removed.' }
    }
    const axes = ['X', 'Y', 'Z']
    if (action === 'insert') {
      const point: number[] = []
      for (let axis = 0; axis < this.dimensions; axis += 1) {
        const value = AdditionalTreeModel.integer(input, axes[axis].toLowerCase())
        if (value < -1024 || value >= 1024) throw new RangeError('Point coordinates must be integers in [-1024, 1024)')
        point.push(value)
      }
      this.capacity()
      this.root ??= new OrthantNode(this.allocateId(), new Array<number>(this.dimensions).fill(-1024), new Array<number>(this.dimensions).fill(1024), 0)
      const inserted = this.insert(this.root, point, observer)
      if (inserted) this.count += 1
      this.emit(observer, this.root.id, 'Publish bucket subdivisions after all points are redistributed.', 'split full bucket; redistribute points', 'split')
      return { description: inserted ? `Inserted (${point.join(', ')}); only occupied orthants allocate nodes.` : 'Duplicate point rejected.' }
    }
    if (action !== 'search-overlap') throw new RangeError('Unsupported orthant-tree action')
    const low: number[] = []
    const high: number[] = []
    for (let axis = 0; axis < this.dimensions; axis += 1) {
      low.push(AdditionalTreeModel.integer(input, `min${axes[axis]}`))
      high.push(AdditionalTreeModel.integer(input, `max${axes[axis]}`))
      if (low[axis] > high[axis]) throw new RangeError('Minimum exceeds maximum')
    }
    const matches: string[] = []
    let activeId: string | null = null
    const visit = (node: OrthantNode): void => {
      for (let axis = 0; axis < this.dimensions; axis += 1) if (high[axis] < node.low[axis] || low[axis] >= node.high[axis]) return
      this.emit(observer, node.id, 'Visit a cell intersecting the inclusive query box.', 'prune disjoint cells; test leaf points', 'compare')
      for (const point of node.points) {
        let inside = true
        for (let axis = 0; axis < this.dimensions; axis += 1) if (point[axis] < low[axis] || point[axis] > high[axis]) inside = false
        if (inside) {
          matches.push(`(${point.join(', ')})`)
          activeId = node.id
        }
      }
      for (const child of node.children.values()) visit(child)
    }
    if (this.root) visit(this.root)
    return { description: `Found ${matches.length} points: ${matches.join('; ') || 'none'}.`, returnValue: matches, activeId, status: matches.length ? 'MATCH' : 'NO MATCH' }
  }
}
