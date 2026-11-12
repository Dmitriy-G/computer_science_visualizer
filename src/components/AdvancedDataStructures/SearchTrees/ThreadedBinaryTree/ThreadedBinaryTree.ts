import { ExtendedTreeModel } from '../../../../visualization/ExtendedTreeModel.ts'
import { AdditionalTreeModel } from '../../../../visualization/AdditionalTreeModel.ts'
import type { TreeDiagramEntry, TreeInputValues, TreeOperationResult } from '../../../../visualization/AdditionalTreeModel.ts'
import type { ActionKind } from '../../../../visualization/ActionCatalog.ts'
import type { TreeTraceObserver } from '../../../../visualization/TreeTrace.ts'
class ThreadedNode {
  public left: ThreadedNode | null = null
  public right: ThreadedNode | null = null
  public leftThread = true
  public rightThread = true
  public readonly id: string
  public readonly key: number
  constructor(id: string, key: number) {
    this.id = id
    this.key = key
  }
}
export class ThreadedBinaryTree extends ExtendedTreeModel {
  public readonly kind = 'threaded-binary-tree'
  private root: ThreadedNode | null = null
  private count = 0
  public get length(): number { return this.count }
  public static createDefault(): ThreadedBinaryTree {
    const tree = new ThreadedBinaryTree()
    for (const key of [50, 20, 80, 10, 30, 60, 90, 40, 70, 100]) tree.execute('insert', { key })
    return tree
  }
  private ordered(): ThreadedNode[] {
    const result: ThreadedNode[] = []
    let node = this.root
    while (node && !node.leftThread) node = node.left
    while (node) {
      result.push(node)
      if (node.rightThread) node = node.right
      else {
        node = node.right
        while (node && !node.leftThread) node = node.left
      }
    }
    return result
  }
  public clone(): ThreadedBinaryTree {
    const copy = new ThreadedBinaryTree()
    const nodes = new Map<string, ThreadedNode>()
    for (const node of this.ordered()) nodes.set(node.id, new ThreadedNode(node.id, node.key))
    for (const node of this.ordered()) {
      const target = nodes.get(node.id)!
      target.leftThread = node.leftThread
      target.rightThread = node.rightThread
      target.left = node.left ? nodes.get(node.left.id)! : null
      target.right = node.right ? nodes.get(node.right.id)! : null
    }
    copy.root = this.root ? nodes.get(this.root.id)! : null
    copy.count = this.count
    copy.nextId = this.nextId
    return copy
  }
  public getThreads(): readonly { from: string
    to: string
    label: string }[] {
    const result: { from: string
      to: string
      label: string }[] = []
    for (const node of this.ordered()) {
      if (node.leftThread && node.left) result.push({ from: node.id, to: node.left.id, label: 'predecessor thread' })
      if (node.rightThread && node.right) result.push({ from: node.id, to: node.right.id, label: 'successor thread' })
    }
    return result
  }
  public getDiagram(): TreeDiagramEntry[] {
    const result: TreeDiagramEntry[] = []
    for (const node of this.ordered()) {
      const children: string[] = []
      if (!node.leftThread && node.left) children.push(node.left.id)
      if (!node.rightThread && node.right) children.push(node.right.id)
      result.push({ id: node.id, text: String(node.key), label: `L ${node.leftThread ? 'thread' : 'child'}; R ${node.rightThread ? 'thread' : 'child'}`, children, width: Math.max(110, String(node.key).length * 10 + 24) })
    }
    return result
  }
  public execute(action: ActionKind, input: TreeInputValues, observer?: TreeTraceObserver): TreeOperationResult {
    if (action === 'traverse-inorder') {
      const values: number[] = []
      let node = this.root
      while (node && !node.leftThread) node = node.left
      while (node) {
        values.push(node.key)
        this.emit(observer, node.id, `Visit ${node.key} and follow its inorder successor.`, 'rightThread ? right : leftmost(right)')
        if (node.rightThread) node = node.right
        else {
          node = node.right
          while (node && !node.leftThread) node = node.left
        }
      }
      return { description: `Inorder through threads: [${values.join(', ')}].`, returnValue: values }
    }
    if (action === 'clear') {
      this.root = null
      this.count = 0
      this.emit(observer, null, 'Release the threaded tree.', 'root = null', 'remove')
      return { description: 'The threaded tree is empty.' }
    }
    if (action !== 'insert' && action !== 'search-value') throw new RangeError('Unsupported threaded-tree action')
    const key = AdditionalTreeModel.integer(input, 'key')
    let node = this.root
    let parent: ThreadedNode | null = null
    while (node) {
      this.emit(observer, node.id, `Compare ${key} with ${node.key}; never descend through a thread.`, 'follow child only when thread flag is false', 'compare')
      if (node.key === key) return { description: action === 'insert' ? 'Duplicate key rejected.' : `Found ${key} at ${node.id}.`, returnValue: true, activeId: node.id, status: 'FOUND' }
      parent = node
      node = key < node.key ? node.leftThread ? null : node.left : node.rightThread ? null : node.right
    }
    if (action === 'search-value') return { description: `Key ${key} is absent.`, returnValue: false }
    this.capacity()
    const added = new ThreadedNode(this.allocateId(), key)
    if (!parent) this.root = added
    else if (key < parent.key) {
      added.left = parent.left
      added.right = parent
      parent.left = added
      parent.leftThread = false
    }
    else {
      added.right = parent.right
      added.left = parent
      parent.right = added
      parent.rightThread = false
    }
    this.count += 1
    this.emit(observer, added.id, 'Connect the leaf and install predecessor/successor threads.', 'new.left = predecessor; new.right = successor', 'connect')
    return { description: `Inserted ${key} with inorder threads.`, activeId: added.id }
  }
}
