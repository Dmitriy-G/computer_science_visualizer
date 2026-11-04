import { ExtendedTreeModel } from '../../../../visualization/ExtendedTreeModel.ts'
import { AdditionalTreeModel } from '../../../../visualization/AdditionalTreeModel.ts'
import type { TreeDiagramEntry, TreeInputValues, TreeOperationResult } from '../../../../visualization/AdditionalTreeModel.ts'
import type { ActionKind } from '../../../../visualization/ActionCatalog.ts'
import type { TreeTraceObserver } from '../../../../visualization/TreeTrace.ts'
class IntervalNode {
  public left: IntervalNode | null = null
  public right: IntervalNode | null = null
  public maximum: number
  public readonly id: string
  public readonly low: number
  public readonly high: number
  constructor(id: string, low: number, high: number) {
    this.id = id
    this.low = low
    this.high = high
   this.maximum = high
 }
}
export class IntervalTree extends ExtendedTreeModel {
  public readonly kind = 'interval-tree'
  private root: IntervalNode | null = null
  private count = 0
  public get length(): number { return this.count }
  public static createDefault(): IntervalTree {
    const tree = new IntervalTree()
    for (const [low, high] of [[15, 20], [10, 30], [17, 19], [5, 20], [12, 15], [30, 40], [1, 4], [8, 9], [22, 26], [42, 50]]) tree.execute('insert', { low, high })
    return tree
  }
  public clone(): IntervalTree {
    const copy = new IntervalTree()
    const visit = (node: IntervalNode | null): IntervalNode | null => {
      if (!node) return null
      const result = new IntervalNode(node.id, node.low, node.high)
      result.maximum = node.maximum
      result.left = visit(node.left)
      result.right = visit(node.right)
      return result
    }
    copy.root = visit(this.root)
    copy.count = this.count
    copy.nextId = this.nextId
    return copy
  }
  public getDiagram(): TreeDiagramEntry[] {
    const entries: TreeDiagramEntry[] = []
    const visit = (node: IntervalNode | null): void => {
      if (!node) return
      const children: string[] = []
      if (node.left) children.push(node.left.id)
      if (node.right) children.push(node.right.id)
      const text = `[${node.low}, ${node.high}]`
      entries.push({ id: node.id, text, label: `subtree max ${node.maximum}`, children, width: Math.max(110, text.length * 10 + 24) })
      visit(node.left)
      visit(node.right)
    }
    visit(this.root)
    return entries
  }
  public execute(action: ActionKind, input: TreeInputValues, observer?: TreeTraceObserver): TreeOperationResult {
    if (action === 'clear') {
      this.root = null
      this.count = 0
      this.emit(observer, null, 'Release all interval nodes.', 'root = null', 'remove')
      return { description: 'The interval tree is empty.' }
    }
    const low = AdditionalTreeModel.integer(input, 'low')
    const high = AdditionalTreeModel.integer(input, 'high')
    if (low > high) throw new RangeError('Lower endpoint exceeds upper endpoint')
    if (action === 'search-overlap') {
      let node = this.root
      while (node) {
        this.emit(observer, node.id, `Compare [${low}, ${high}] with [${node.low}, ${node.high}].`, 'overlap ? found : left.max >= low ? left : right', 'compare')
        if (node.low <= high && low <= node.high) return { description: `Found overlapping interval [${node.low}, ${node.high}] at ${node.id}.`, returnValue: `[${node.low}, ${node.high}]`, activeId: node.id, status: 'OVERLAP' }
        node = node.left && node.left.maximum >= low ? node.left : node.right
      }
      return { description: 'No stored interval overlaps this inclusive range.', returnValue: null }
    }
    if (action !== 'insert') throw new RangeError('Unsupported interval action')
    let node = this.root
    const path: IntervalNode[] = []
    while (node) {
      path.push(node)
      this.emit(observer, node.id, 'Compare intervals lexicographically by their endpoints.', 'compare (low, high)', 'compare')
      if (node.low === low && node.high === high) return { description: 'Duplicate interval rejected.', activeId: node.id }
      node = low < node.low || (low === node.low && high < node.high) ? node.left : node.right
    }
    this.capacity()
    const added = new IntervalNode(this.allocateId(), low, high)
    const parent = path.at(-1)
    if (!parent) this.root = added
    else if (low < parent.low || (low === parent.low && high < parent.high)) parent.left = added
    else parent.right = added
    for (const ancestor of path) ancestor.maximum = Math.max(ancestor.maximum, high)
    this.count += 1
    this.emit(observer, added.id, 'Insert the interval and propagate maximum high endpoints.', 'ancestor.max = max(ancestor.max, high)', 'connect')
    return { description: `Inserted [${low}, ${high}]. This augmented BST is unbalanced.` }
  }
}
