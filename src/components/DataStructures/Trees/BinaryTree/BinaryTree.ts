export interface BinaryTreeEntry {
  readonly id: string
  readonly value: number
  readonly leftId: string | null
  readonly rightId: string | null
}

class BinaryTreeNode {
  public readonly id: string
  public readonly value: number
  public left: BinaryTreeNode | null = null
  public right: BinaryTreeNode | null = null

  constructor(id: string, value: number) {
    this.id = id
    this.value = value
  }

  public toEntry(): BinaryTreeEntry {
    return {
      id: this.id,
      value: this.value,
      leftId: this.left?.id ?? null,
      rightId: this.right?.id ?? null,
    }
  }
}

export class BinaryTree {
  private root: BinaryTreeNode | null = null
  private size = 0
  private nextId = 0

  public get length(): number {
    return this.size
  }

  public static createDefault(): BinaryTree {
    const tree = new BinaryTree()
    for (const value of [50, 30, 80, 20, 40, 70, 90, 10, 60, 100]) {
      tree.insert(value)
    }
    return tree
  }

  public insert(value: number): BinaryTreeEntry {
    if (!Number.isSafeInteger(value)) {
      throw new TypeError('Node values must be safe integers')
    }
    const node = new BinaryTreeNode(`tree-node-${this.nextId}`, value)
    if (this.root === null) {
      this.root = node
    } else {
      let current = this.root
      while (true) {
        if (value < current.value) {
          if (current.left === null) {
            current.left = node
            break
          }
          current = current.left
        } else {
          if (current.right === null) {
            current.right = node
            break
          }
          current = current.right
        }
      }
    }
    this.nextId += 1
    this.size += 1
    return node.toEntry()
  }

  public getSearchPath(value: number): BinaryTreeEntry[] {
    if (!Number.isSafeInteger(value)) throw new TypeError('Values must be safe integers')
    const path: BinaryTreeEntry[] = []
    let current = this.root
    while (current !== null) {
      path.push(current.toEntry())
      if (value === current.value) break
      current = value < current.value ? current.left : current.right
    }
    return path
  }

  public deleteValue(value: number): BinaryTreeEntry | null {
    if (!Number.isSafeInteger(value)) throw new TypeError('Values must be safe integers')
    let parent: BinaryTreeNode | null = null
    let current = this.root
    while (current !== null && current.value !== value) {
      parent = current
      current = value < current.value ? current.left : current.right
    }
    if (current === null) return null
    const removed = current.toEntry()
    let replacement = current.left ?? current.right
    if (current.left !== null && current.right !== null) {
      let successorParent = current
      let successor = current.right
      while (successor.left !== null) {
        successorParent = successor
        successor = successor.left
      }
      if (successorParent !== current) {
        successorParent.left = successor.right
        successor.right = current.right
      }
      successor.left = current.left
      replacement = successor
    }
    if (parent === null) this.root = replacement
    else if (parent.left === current) parent.left = replacement
    else parent.right = replacement
    this.size -= 1
    return removed
  }

  public clear(): void {
    const stack: { node: BinaryTreeNode; parent: BinaryTreeNode | null; expanded: boolean }[] = []
    if (this.root) stack.push({ node: this.root, parent: null, expanded: false })
    while (stack.length > 0) {
      const { node, parent, expanded } = stack.pop()!
      if (!expanded) {
        stack.push({ node, parent, expanded: true })
        if (node.right) stack.push({ node: node.right, parent: node, expanded: false })
        if (node.left) stack.push({ node: node.left, parent: node, expanded: false })
      } else {
        node.left = null
        node.right = null
        if (parent === null) this.root = null
        else if (parent.left === node) parent.left = null
        else parent.right = null
        this.size -= 1
      }
    }
    this.root = null
  }

  public getEntries(): BinaryTreeEntry[] {
    const entries: BinaryTreeEntry[] = []
    const stack: BinaryTreeNode[] = []
    if (this.root) stack.push(this.root)
    while (stack.length > 0) {
      const node = stack.pop()!
      entries.push(node.toEntry())
      if (node.right) stack.push(node.right)
      if (node.left) stack.push(node.left)
    }
    return entries
  }

  public clone(): BinaryTree {
    const copy = new BinaryTree()
    const nodes = new Map<string, BinaryTreeNode>()
    const entries = this.getEntries()
    for (const entry of entries) {
      nodes.set(entry.id, new BinaryTreeNode(entry.id, entry.value))
    }
    for (const entry of entries) {
      const node = nodes.get(entry.id)!
      node.left = entry.leftId === null ? null : nodes.get(entry.leftId)!
      node.right = entry.rightId === null ? null : nodes.get(entry.rightId)!
    }
    copy.root = entries.length === 0 ? null : nodes.get(entries[0].id)!
    copy.size = this.size
    copy.nextId = this.nextId
    return copy
  }
}
