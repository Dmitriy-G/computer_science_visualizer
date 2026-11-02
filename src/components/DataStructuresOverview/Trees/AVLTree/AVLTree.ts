import { TreeTrace } from '../../../../visualization/TreeTrace.ts'
import type { BinarySearchEntry, TreeTraceObserver } from '../../../../visualization/TreeTrace.ts'

export type AVLTreeEntry = BinarySearchEntry

class AVLNode {
  public readonly id: string
  public readonly value: number
  public left: AVLNode | null = null
  public right: AVLNode | null = null
  public parent: AVLNode | null = null
  public height = 1

  constructor(id: string, value: number) {
    this.id = id
    this.value = value
  }

  public toEntry(): AVLTreeEntry {
    return { id: this.id, value: this.value, leftId: this.left?.id ?? null, rightId: this.right?.id ?? null, height: this.height }
  }
}

export class AVLTree {
  private root: AVLNode | null = null
  private count = 0
  private nextId = 0

  public get length(): number { return this.count }

  public static createDefault(): AVLTree {
    const tree = new AVLTree()
    for (let value = 10; value <= 100; value += 10) tree.insert(value)
    return tree
  }

  public find(value: number, observer?: TreeTraceObserver): AVLTreeEntry | null {
    return this.findNode(value, observer)?.toEntry() ?? null
  }

  public insert(value: number, observer?: TreeTraceObserver): boolean {
    TreeTrace.validate(value)
    let parent: AVLNode | null = null
    let current: AVLNode | null = this.root
    while (current) {
      this.compare(current, value, observer)
      if (current.value === value) return false
      parent = current
      current = value < current.value ? current.left : current.right
    }
    const node = new AVLNode(`avl-${this.nextId}`, value)
    this.nextId += 1
    node.parent = parent
    if (!parent) this.root = node
    else if (value < parent.value) parent.left = node
    else parent.right = node
    this.count += 1
    TreeTrace.emit(observer, 'create', node.id, 'Create a pending leaf', `Create ${value} with height 1 and empty children. Equal keys are not inserted twice.`, 'node = Leaf(value, height = 1)', node.id)
    TreeTrace.emit(observer, 'connect', node.id, 'Connect the leaf', 'Connect the new leaf at the empty child position, then inspect its ancestors.', 'parent.child = node  // or root = node')
    this.rebalance(parent, observer)
    return true
  }

  public deleteValue(value: number, observer?: TreeTraceObserver): boolean {
    const target = this.findNode(value, observer)
    if (!target) return false
    let start: AVLNode | null
    if (!target.left || !target.right) {
      start = target.parent
      this.replace(target, target.left ?? target.right)
    } else {
      let successor: AVLNode = target.right
      while (successor.left) {
        TreeTrace.emit(observer, 'visit', successor.id, 'Find the successor', 'Follow left children in the right subtree to find the next greater key.', 'successor = successor.left')
        successor = successor.left
      }
      if (successor.parent === target) {
        this.replace(target, successor)
        successor.left = target.left
        successor.left.parent = successor
        start = successor
      } else {
        start = successor.parent
        this.replace(successor, successor.right)
        successor.right = target.right
        successor.right.parent = successor
        this.replace(target, successor)
        successor.left = target.left
        successor.left.parent = successor
      }
      successor.height = target.height
    }
    target.left = null
    target.right = null
    target.parent = null
    this.count -= 1
    TreeTrace.emit(observer, 'remove', start?.id ?? this.root?.id ?? null, 'Remove the matching node', 'Reconnect its surviving child or successor. Surviving nodes keep their IDs and values.', 'transplant target with child or successor')
    this.rebalance(start, observer)
    return true
  }

  public clear(observer?: TreeTraceObserver): void {
    const stack: { node: AVLNode; expanded: boolean }[] = []
    if (this.root) stack.push({ node: this.root, expanded: false })
    while (stack.length) {
      const { node, expanded } = stack.pop()!
      if (!expanded) {
        stack.push({ node, expanded: true })
        if (node.right) stack.push({ node: node.right, expanded: false })
        if (node.left) stack.push({ node: node.left, expanded: false })
      } else {
        this.replace(node, null)
        node.parent = null
        this.count -= 1
        TreeTrace.emit(observer, 'remove', this.root?.id ?? null, 'Release a node', `Release ${node.value} after both children. Clear does not rebalance a tree being discarded.`, 'release node')
      }
    }
  }

  public getEntries(): AVLTreeEntry[] {
    const entries: AVLTreeEntry[] = []
    const stack: AVLNode[] = []
    if (this.root) stack.push(this.root)
    while (stack.length) {
      const node = stack.pop()!
      entries.push(node.toEntry())
      if (node.right) stack.push(node.right)
      if (node.left) stack.push(node.left)
    }
    return entries
  }

  public clone(): AVLTree {
    const copy = new AVLTree()
    const nodes = new Map<string, AVLNode>()
    const entries = this.getEntries()
    for (const entry of entries) {
      const node = new AVLNode(entry.id, entry.value)
      node.height = entry.height!
      nodes.set(entry.id, node)
    }
    for (const entry of entries) {
      const node = nodes.get(entry.id)!
      node.left = entry.leftId ? nodes.get(entry.leftId)! : null
      node.right = entry.rightId ? nodes.get(entry.rightId)! : null
      if (node.left) node.left.parent = node
      if (node.right) node.right.parent = node
    }
    copy.root = entries[0] ? nodes.get(entries[0].id)! : null
    copy.count = this.count
    copy.nextId = this.nextId
    return copy
  }

  private compare(node: AVLNode, value: number, observer?: TreeTraceObserver): void {
    TreeTrace.emit(observer, 'compare', node.id, `Compare ${value} with ${node.value}`, value === node.value ? 'This key already exists. Insertion leaves the tree unchanged; search or deletion uses this node.' : `Follow the ${value < node.value ? 'left' : 'right'} child.`, 'compare value with node.key')
  }

  private findNode(value: number, observer?: TreeTraceObserver): AVLNode | null {
    TreeTrace.validate(value)
    let current: AVLNode | null = this.root
    while (current) {
      this.compare(current, value, observer)
      if (current.value === value) return current
      current = value < current.value ? current.left : current.right
    }
    return null
  }

  private replace(node: AVLNode, replacement: AVLNode | null): void {
    if (!node.parent) this.root = replacement
    else if (node.parent.left === node) node.parent.left = replacement
    else node.parent.right = replacement
    if (replacement) replacement.parent = node.parent
  }

  private update(node: AVLNode): void {
    node.height = 1 + Math.max(node.left?.height ?? 0, node.right?.height ?? 0)
  }

  private balance(node: AVLNode): number {
    return (node.left?.height ?? 0) - (node.right?.height ?? 0)
  }

  private rotate(node: AVLNode, left: boolean, observer?: TreeTraceObserver): AVLNode {
    const promoted = left ? node.right! : node.left!
    const middle = left ? promoted.left : promoted.right
    this.replace(node, promoted)
    if (left) {
      node.right = middle
      promoted.left = node
    } else {
      node.left = middle
      promoted.right = node
    }
    if (middle) middle.parent = node
    node.parent = promoted
    this.update(node)
    this.update(promoted)
    TreeTrace.emit(observer, 'rotate', promoted.id, `Rotate ${left ? 'left' : 'right'} at ${node.value}`, 'Promote the heavy child while preserving sorted order. Recompute both cached heights.', left ? 'rotateLeft(node)' : 'rotateRight(node)')
    return promoted
  }

  private rebalance(start: AVLNode | null, observer?: TreeTraceObserver): void {
    let current: AVLNode | null = start
    while (current) {
      this.update(current)
      const balance = this.balance(current)
      TreeTrace.emit(observer, 'visit', current.id, `Check balance at ${current.value}`, `Balance is left height minus right height: ${balance}. Legal values are -1, 0, and 1.`, 'height = 1 + max(left.height, right.height)\nbalance = left.height - right.height')
      if (balance > 1) {
        if (this.balance(current.left!) < 0) this.rotate(current.left!, true, observer)
        current = this.rotate(current, false, observer)
      } else if (balance < -1) {
        if (this.balance(current.right!) > 0) this.rotate(current.right!, false, observer)
        current = this.rotate(current, true, observer)
      }
      current = current.parent
    }
  }
}
