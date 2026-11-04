import { TreeTrace } from '../../../../visualization/TreeTrace.ts'
import type { BinarySearchEntry, TreeTraceObserver } from '../../../../visualization/TreeTrace.ts'

export type RedBlackTreeEntry = BinarySearchEntry
type Color = 'red' | 'black'

class RedBlackNode {
  public readonly id: string
  public readonly value: number
  public color: Color = 'red'
  public left!: RedBlackNode
  public right!: RedBlackNode
  public parent!: RedBlackNode

  constructor(id: string, value: number) {
    this.id = id
    this.value = value
  }
}

export class RedBlackTree {
  private readonly nil: RedBlackNode
  private root: RedBlackNode
  private count = 0
  private nextId = 0

  constructor() {
    this.nil = new RedBlackNode('rb-nil', 0)
    this.nil.color = 'black'
    this.nil.left = this.nil
    this.nil.right = this.nil
    this.nil.parent = this.nil
    this.root = this.nil
  }

  public get length(): number { return this.count }

  public static createDefault(): RedBlackTree {
    const tree = new RedBlackTree()
    for (let value = 10; value <= 100; value += 10) tree.insert(value)
    return tree
  }

  public find(value: number, observer?: TreeTraceObserver): RedBlackTreeEntry | null {
    const node = this.findNode(value, observer)
    return node === this.nil ? null : this.entry(node)
  }

  public insert(value: number, observer?: TreeTraceObserver): boolean {
    TreeTrace.validate(value)
    let parent = this.nil
    let current = this.root
    while (current !== this.nil) {
      this.compare(current, value, observer)
      if (current.value === value) return false
      parent = current
      current = value < current.value ? current.left : current.right
    }
    const node = new RedBlackNode(`rb-${this.nextId}`, value)
    this.nextId += 1
    node.left = this.nil
    node.right = this.nil
    node.parent = parent
    if (parent === this.nil) this.root = node
    else if (value < parent.value) parent.left = node
    else parent.right = node
    this.count += 1
    TreeTrace.emit(observer, 'create', node.id, 'Create a red leaf', 'New leaves start red so the black height of existing paths is unchanged. Missing children are black NIL sentinels.', 'node = RedLeaf(value)', node.id)
    TreeTrace.emit(observer, 'connect', node.id, 'Connect the red leaf', 'Check for a red parent. A red node cannot have a red child.', 'parent.child = node  // or root = node')
    let repair = node
    while (repair.parent.color === 'red') {
      const parentOnLeft = repair.parent === repair.parent.parent.left
      const uncle = parentOnLeft ? repair.parent.parent.right : repair.parent.parent.left
      if (uncle.color === 'red') {
        repair.parent.color = 'black'
        uncle.color = 'black'
        repair.parent.parent.color = 'red'
        repair = repair.parent.parent
        TreeTrace.emit(observer, 'recolor', repair.id, 'Recolor a red parent and uncle', 'Make parent and uncle black and grandparent red. Continue checking upward.', 'parent.color = uncle.color = BLACK\ngrandparent.color = RED')
      } else {
        if (repair === (parentOnLeft ? repair.parent.right : repair.parent.left)) {
          repair = repair.parent
          this.rotate(repair, parentOnLeft, observer)
        }
        repair.parent.color = 'black'
        repair.parent.parent.color = 'red'
        TreeTrace.emit(observer, 'recolor', repair.parent.id, 'Recolor before the outer rotation', 'The promoted parent becomes black and its grandparent becomes red.', 'parent.color = BLACK\ngrandparent.color = RED')
        this.rotate(repair.parent.parent, !parentOnLeft, observer)
      }
    }
    this.root.color = 'black'
    TreeTrace.emit(observer, 'recolor', this.root.id, 'Keep the root black', 'The root is black, red nodes have black children, and all paths to NIL have the same black height.', 'root.color = BLACK')
    return true
  }

  public deleteValue(value: number, observer?: TreeTraceObserver): boolean {
    const target = this.findNode(value, observer)
    if (target === this.nil) return false
    let removed = target
    let originalColor = removed.color
    let repair: RedBlackNode
    if (target.left === this.nil) {
      repair = target.right
      this.replace(target, target.right)
    } else if (target.right === this.nil) {
      repair = target.left
      this.replace(target, target.left)
    } else {
      removed = target.right
      while (removed.left !== this.nil) {
        TreeTrace.emit(observer, 'visit', removed.id, 'Find the successor', 'Follow left pointers in the right subtree. Move the successor node without changing its ID or key.', 'successor = successor.left')
        removed = removed.left
      }
      originalColor = removed.color
      repair = removed.right
      if (removed.parent === target) repair.parent = removed
      else {
        this.replace(removed, removed.right)
        removed.right = target.right
        removed.right.parent = removed
      }
      this.replace(target, removed)
      removed.left = target.left
      removed.left.parent = removed
      removed.color = target.color
    }
    target.left = this.nil
    target.right = this.nil
    target.parent = this.nil
    this.count -= 1
    TreeTrace.emit(observer, 'remove', this.visible(repair), 'Remove the matching node', originalColor === 'black' ? 'Removing black may leave one path short of a black node. Repair this deficit using sibling colors and rotations.' : 'Removing red does not change the black height of any path.', 'transplant target with child or successor')
    if (originalColor === 'black') this.repairDeletion(repair, observer)
    this.nil.parent = this.nil
    return true
  }

  public clear(observer?: TreeTraceObserver): void {
    const stack: { node: RedBlackNode; expanded: boolean }[] = []
    if (this.root !== this.nil) stack.push({ node: this.root, expanded: false })
    while (stack.length) {
      const { node, expanded } = stack.pop()!
      if (!expanded) {
        stack.push({ node, expanded: true })
        if (node.right !== this.nil) stack.push({ node: node.right, expanded: false })
        if (node.left !== this.nil) stack.push({ node: node.left, expanded: false })
      } else {
        this.replace(node, this.nil)
        node.parent = this.nil
        this.count -= 1
        TreeTrace.emit(observer, 'remove', this.root === this.nil ? null : this.root.id, 'Release a node', `Release ${node.value} after its children. Clear discards the entire tree without running deletion fix-up for every key.`, 'release node')
      }
    }
    this.nil.parent = this.nil
  }

  public getEntries(): RedBlackTreeEntry[] {
    const entries: RedBlackTreeEntry[] = []
    const stack: RedBlackNode[] = []
    if (this.root !== this.nil) stack.push(this.root)
    while (stack.length) {
      const node = stack.pop()!
      entries.push(this.entry(node))
      if (node.right !== this.nil) stack.push(node.right)
      if (node.left !== this.nil) stack.push(node.left)
    }
    return entries
  }

  public clone(): RedBlackTree {
    const copy = new RedBlackTree()
    const nodes = new Map<string, RedBlackNode>()
    const entries = this.getEntries()
    for (const entry of entries) {
      const node = new RedBlackNode(entry.id, entry.value)
      node.color = entry.color!
      node.parent = copy.nil
      nodes.set(entry.id, node)
    }
    for (const entry of entries) {
      const node = nodes.get(entry.id)!
      node.left = entry.leftId ? nodes.get(entry.leftId)! : copy.nil
      node.right = entry.rightId ? nodes.get(entry.rightId)! : copy.nil
      if (node.left !== copy.nil) node.left.parent = node
      if (node.right !== copy.nil) node.right.parent = node
    }
    copy.root = entries[0] ? nodes.get(entries[0].id)! : copy.nil
    copy.count = this.count
    copy.nextId = this.nextId
    return copy
  }

  private entry(node: RedBlackNode): RedBlackTreeEntry {
    return { id: node.id, value: node.value, leftId: node.left === this.nil ? null : node.left.id, rightId: node.right === this.nil ? null : node.right.id, color: node.color }
  }

  private visible(node: RedBlackNode): string | null {
    if (node !== this.nil) return node.id
    return node.parent === this.nil ? null : node.parent.id
  }

  private compare(node: RedBlackNode, value: number, observer?: TreeTraceObserver): void {
    TreeTrace.emit(observer, 'compare', node.id, `Compare ${value} with ${node.value}`, value === node.value ? 'The key exists. Duplicate insertion is a no-op.' : `Follow the ${value < node.value ? 'left' : 'right'} child.`, 'compare value with node.key')
  }

  private findNode(value: number, observer?: TreeTraceObserver): RedBlackNode {
    TreeTrace.validate(value)
    let current = this.root
    while (current !== this.nil) {
      this.compare(current, value, observer)
      if (current.value === value) return current
      current = value < current.value ? current.left : current.right
    }
    return this.nil
  }

  private replace(node: RedBlackNode, replacement: RedBlackNode): void {
    if (node.parent === this.nil) this.root = replacement
    else if (node.parent.left === node) node.parent.left = replacement
    else node.parent.right = replacement
    replacement.parent = node.parent
  }

  private rotate(node: RedBlackNode, left: boolean, observer?: TreeTraceObserver): void {
    const promoted = left ? node.right : node.left
    const middle = left ? promoted.left : promoted.right
    this.replace(node, promoted)
    if (left) {
      node.right = middle
      promoted.left = node
    } else {
      node.left = middle
      promoted.right = node
    }
    if (middle !== this.nil) middle.parent = node
    node.parent = promoted
    TreeTrace.emit(observer, 'rotate', promoted.id, `Rotate ${left ? 'left' : 'right'} at ${node.value}`, 'Promote a child and reconnect the middle subtree while preserving sorted order.', left ? 'rotateLeft(node)' : 'rotateRight(node)')
  }

  private repairDeletion(start: RedBlackNode, observer?: TreeTraceObserver): void {
    let current = start
    while (current !== this.root && current.color === 'black') {
      const left = current === current.parent.left
      let sibling = left ? current.parent.right : current.parent.left
      if (sibling.color === 'red') {
        sibling.color = 'black'
        current.parent.color = 'red'
        TreeTrace.emit(observer, 'recolor', sibling.id, 'Turn a red sibling black', 'Recolor and rotate the parent to obtain a black sibling case.', 'sibling.color = BLACK\nparent.color = RED')
        this.rotate(current.parent, left, observer)
        sibling = left ? current.parent.right : current.parent.left
      }
      const near = left ? sibling.left : sibling.right
      const far = left ? sibling.right : sibling.left
      if (near.color === 'black' && far.color === 'black') {
        if (sibling !== this.nil) sibling.color = 'red'
        current = current.parent
        TreeTrace.emit(observer, 'recolor', this.visible(current), 'Move the black deficit upward', 'A black sibling with two black children can turn red. Continue at the parent.', 'sibling.color = RED\ncurrent = parent')
      } else {
        if (far.color === 'black') {
          near.color = 'black'
          sibling.color = 'red'
          TreeTrace.emit(observer, 'recolor', sibling.id, 'Prepare the far red child', 'Recolor the near child and rotate the sibling so the far child becomes red.', 'near.color = BLACK\nsibling.color = RED')
          this.rotate(sibling, !left, observer)
          sibling = left ? current.parent.right : current.parent.left
        }
        sibling.color = current.parent.color
        current.parent.color = 'black'
        const farChild = left ? sibling.right : sibling.left
        farChild.color = 'black'
        TreeTrace.emit(observer, 'recolor', sibling.id, 'Resolve the black deficit', 'Copy the parent color to its sibling and make the parent and far child black.', 'sibling.color = parent.color\nparent.color = far.color = BLACK')
        this.rotate(current.parent, left, observer)
        current = this.root
      }
    }
    current.color = 'black'
    this.nil.color = 'black'
    TreeTrace.emit(observer, 'recolor', this.root === this.nil ? null : this.root.id, 'Restore the black-height rules', 'The root and NIL leaves are black, red nodes have black children, and all root-to-NIL paths have equal black height.', 'current.color = BLACK')
  }
}
