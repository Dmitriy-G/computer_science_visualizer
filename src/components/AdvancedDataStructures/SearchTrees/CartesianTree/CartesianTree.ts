import { ExtendedTreeModel } from '../../../../visualization/ExtendedTreeModel.ts'
import { AdditionalTreeModel } from '../../../../visualization/AdditionalTreeModel.ts'
import type { TreeDiagramEntry, TreeInputValues, TreeOperationResult } from '../../../../visualization/AdditionalTreeModel.ts'
import type { ActionKind } from '../../../../visualization/ActionCatalog.ts'
import type { TreeTraceObserver } from '../../../../visualization/TreeTrace.ts'
class CartesianNode {
  public left: CartesianNode | null = null
  public right: CartesianNode | null = null
  public readonly id: string
  public readonly value: number
  public readonly index: number
  constructor(id: string, value: number, index: number) {
    this.id = id
    this.value = value
    this.index = index
  }
}
export class CartesianTree extends ExtendedTreeModel {
  public readonly kind = 'cartesian-tree'
  private nodes: CartesianNode[] = []
  private spine: CartesianNode[] = []
  private root: CartesianNode | null = null
  public get length(): number { return this.nodes.length }
  public static createDefault(): CartesianTree {
    const tree = new CartesianTree()
    for (const value of [9, 3, 7, 1, 8, 2, 6, 4, 10, 5]) tree.execute('insert', { value })
    return tree
  }
  public clone(): CartesianTree {
    const copy = new CartesianTree()
    const byId = new Map<string, CartesianNode>()
    for (const node of this.nodes) {
      const target = new CartesianNode(node.id, node.value, node.index)
      copy.nodes.push(target)
      byId.set(node.id, target)
    }
    for (const node of this.nodes) {
      const target = byId.get(node.id)!
      target.left = node.left ? byId.get(node.left.id)! : null
      target.right = node.right ? byId.get(node.right.id)! : null
    }
    for (const node of this.spine) copy.spine.push(byId.get(node.id)!)
    copy.root = this.root ? byId.get(this.root.id)! : null
    copy.nextId = this.nextId
    return copy
  }
  public getDiagram(): TreeDiagramEntry[] {
    const entries: TreeDiagramEntry[] = []
    for (const node of this.nodes) {
      const children: string[] = []
      if (node.left) children.push(node.left.id)
      if (node.right) children.push(node.right.id)
      entries.push({ id: node.id, text: String(node.value), label: `array index ${node.index}`, children, width: Math.max(110, String(node.value).length * 10 + 24) })
    }
    return entries
  }
  public execute(action: ActionKind, input: TreeInputValues, observer?: TreeTraceObserver): TreeOperationResult {
    if (action === 'clear') {
      this.nodes = []
      this.spine = []
      this.root = null
      this.emit(observer, null, 'Release the Cartesian tree and right-spine stack.', 'clear nodes and spine', 'remove')
      return { description: 'The Cartesian tree is empty.' }
    }
    if (action === 'insert') {
      const value = AdditionalTreeModel.integer(input, 'value')
      this.capacity()
      let last: CartesianNode | null = null
      while (this.spine.length && this.spine[this.spine.length - 1].value > value) {
        last = this.spine.pop()!
        this.emit(observer, last.id, `Pop ${last.value} from the monotone right spine.`, 'while spine.top.value > value: pop()', 'compare')
      }
      const node = new CartesianNode(this.allocateId(), value, this.length)
      node.left = last
      if (this.spine.length) this.spine[this.spine.length - 1].right = node
      else this.root = node
      this.spine.push(node)
      this.nodes.push(node)
      this.emit(observer, node.id, 'Attach the popped subtree on the left and the new index on the right spine.', 'new.left = lastPopped; spine.top.right = new', 'connect')
      return { description: `Appended ${value}; inorder is array order and parents hold minima. Equal values keep the earlier index above.` }
    }
    if (action !== 'range-min') throw new RangeError('Unsupported Cartesian action')
    const minimum = this.index(input, 'minimum')
    const maximum = this.index(input, 'maximum')
    if (minimum > maximum) throw new RangeError('Minimum index exceeds maximum')
    let node = this.root
    while (node) {
      this.emit(observer, node.id, `Compare root index ${node.index} with [${minimum}, ${maximum}].`, 'interval left of root ? left : interval right of root ? right : root', 'compare')
      if (node.index < minimum) node = node.right
      else if (node.index > maximum) node = node.left
      else return { description: `Minimum on [${minimum}, ${maximum}] is ${node.value} at index ${node.index}.`, returnValue: node.value, activeId: node.id, status: 'MINIMUM' }
    }
    throw new RangeError('Invalid range')
  }
}
