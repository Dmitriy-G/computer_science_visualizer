import { ExtendedTreeModel } from '../ExtendedTreeModel.ts'
import { AdditionalTreeModel } from '../../../../visualization/AdditionalTreeModel.ts'
import type { TreeDiagramEntry, TreeInputValues, TreeOperationResult } from '../../../../visualization/AdditionalTreeModel.ts'
import type { ActionKind } from '../../../../visualization/ActionCatalog.ts'
import type { TreeTraceObserver } from '../../../../visualization/TreeTrace.ts'
class KDNode {
  public left: KDNode | null = null
  public right: KDNode | null = null
  public readonly id: string
  public readonly point: readonly number[]
  public readonly axis: number
  constructor(id: string, point: readonly number[], axis: number) {
    this.id = id
    this.point = point
    this.axis = axis
  }
}
export class KDTree extends ExtendedTreeModel {
  public readonly kind = 'kd-tree'
  private root: KDNode | null = null
  private count = 0
  public get length(): number { return this.count }
  public static createDefault(): KDTree {
    const tree = new KDTree()
    for (const [x, y] of [[5, 5], [2, 8], [8, 2], [1, 3], [3, 9], [7, 1], [9, 6], [4, 4], [6, 7], [10, 10]]) tree.execute('insert', { x, y })
    return tree
  }
  public clone(): KDTree {
    const copy = new KDTree()
    const visit = (node: KDNode | null): KDNode | null => {
      if (!node) return null
      const target = new KDNode(node.id, [...node.point], node.axis)
      target.left = visit(node.left)
      target.right = visit(node.right)
      return target
    }
    copy.root = visit(this.root)
    copy.count = this.count
    copy.nextId = this.nextId
    return copy
  }
  public getDiagram(): TreeDiagramEntry[] {
    const result: TreeDiagramEntry[] = []
    const visit = (node: KDNode | null): void => {
      if (!node) return
      const children: string[] = []
      if (node.left) children.push(node.left.id)
      if (node.right) children.push(node.right.id)
      const text = `(${node.point.join(', ')})`
      result.push({ id: node.id, text, label: `split ${node.axis === 0 ? 'X' : 'Y'} = ${node.point[node.axis]}`, children, width: Math.max(110, text.length * 10 + 24) })
      visit(node.left)
      visit(node.right)
    }
    visit(this.root)
    return result
  }
  public execute(action: ActionKind, input: TreeInputValues, observer?: TreeTraceObserver): TreeOperationResult {
    if (action === 'clear') {
      this.root = null
      this.count = 0
      this.emit(observer, null, 'Release KD split nodes.', 'root = null', 'remove')
      return { description: 'The KD-tree is empty.' }
    }
    if (action === 'insert') {
      const point = [AdditionalTreeModel.integer(input, 'x'), AdditionalTreeModel.integer(input, 'y')]
      let node = this.root
      let parent: KDNode | null = null
      while (node) {
        this.emit(observer, node.id, 'Compare on the alternating split axis.', 'point[axis] < node[axis] ? left : right', 'compare')
        if (point[0] === node.point[0] && point[1] === node.point[1]) return { description: 'Duplicate point rejected.', activeId: node.id }
        parent = node
        node = point[node.axis] < node.point[node.axis] ? node.left : node.right
      }
      this.capacity()
      const added = new KDNode(this.allocateId(), point, parent ? 1 - parent.axis : 0)
      if (!parent) this.root = added
      else if (point[parent.axis] < parent.point[parent.axis]) parent.left = added
      else parent.right = added
      this.count += 1
      this.emit(observer, added.id, 'Connect the point with the next alternating split axis.', 'parent.child = new KDNode(point, nextAxis)', 'connect')
      return { description: `Inserted (${point.join(', ')}). Incremental insertion does not rebalance the KD-tree.` }
    }
    if (action !== 'search-overlap') throw new RangeError('Unsupported KD action')
    const low = [AdditionalTreeModel.integer(input, 'minX'), AdditionalTreeModel.integer(input, 'minY')]
    const high = [AdditionalTreeModel.integer(input, 'maxX'), AdditionalTreeModel.integer(input, 'maxY')]
    if (low[0] > high[0] || low[1] > high[1]) throw new RangeError('Minimum exceeds maximum')
    const matches: string[] = []
    let activeId: string | null = null
    const visit = (node: KDNode | null): void => {
      if (!node) return
      this.emit(observer, node.id, 'Test the point and prune branches beyond the split plane.', 'recurse only where query crosses split', 'compare')
      if (low[0] <= node.point[0] && node.point[0] <= high[0] && low[1] <= node.point[1] && node.point[1] <= high[1]) {
        matches.push(`(${node.point.join(', ')})`)
        activeId = node.id
      }
      if (low[node.axis] < node.point[node.axis]) visit(node.left)
      if (high[node.axis] >= node.point[node.axis]) visit(node.right)
    }
    visit(this.root)
    return { description: `Found ${matches.length} points: ${matches.join('; ') || 'none'}.`, returnValue: matches, activeId, status: matches.length ? 'MATCH' : 'NO MATCH' }
  }
}
