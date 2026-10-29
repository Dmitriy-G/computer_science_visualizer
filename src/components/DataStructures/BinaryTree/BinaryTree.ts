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
