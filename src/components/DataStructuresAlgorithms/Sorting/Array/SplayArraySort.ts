import { ArraySortOperations } from './ArraySortOperations.ts'
import type { ArrayEntry } from '../../../DataStructuresOverview/Linear/Array/FixedArray.ts'
import type { ArraySortEvent, ArraySortFrame, ArraySortTreeNode } from './ArraySortTrace.ts'

class SplaySortNode {
  public readonly entry: ArrayEntry
  public parent: SplaySortNode | null = null
  public left: SplaySortNode | null = null
  public right: SplaySortNode | null = null
  constructor(entry: ArrayEntry) { this.entry = entry }
}

export class SplayArraySort extends ArraySortOperations {
  private root: SplaySortNode | null = null
  private readonly nodes: SplaySortNode[] = []
  private output: (ArrayEntry | null)[] | undefined

  public sort(): void {
    if (this.entries.length < 2) return
    for (let index = 0; index < this.entries.length; index += 1) {
      const entry = this.entries[index]
      let parent: SplaySortNode | null = null
      let current: SplaySortNode | null = this.root
      while (current) {
        parent = current
        this.step('compare', 'Find the insertion position in the splay tree', `Insert key ${entry.value}: smaller keys descend left; equal or larger keys descend right.`, 'key < node.key ? left : right', current, { activeIndices: [index] })
        current = entry.value < current.entry.value ? current.left : current.right
      }
      const node = new SplaySortNode(entry)
      node.parent = parent
      if (!parent) this.root = node
      else if (entry.value < parent.entry.value) parent.left = node
      else parent.right = node
      this.nodes.push(node)
      this.step('place', 'Attach the new entry before splaying', 'Store the original entry in a tree node. Rotations will preserve inorder entry order, including ties.', 'attach leaf under search parent', node, { activeIndices: [index] })
      this.splay(node)
    }
    this.output = new Array<ArrayEntry | null>(this.entries.length).fill(null)
    let node: SplaySortNode | null = this.root
    while (node?.left) node = node.left
    let destination = 0
    while (node) {
      this.output[destination++] = node.entry
      this.step('write', 'Read the next splay-tree entry in order', `Append key ${node.entry.value} to output. Parent links support linear inorder traversal even when the current tree is a chain.`, 'output.push(inorder.next())', node)
      if (node.right) {
        node = node.right
        while (node.left) node = node.left
      } else {
        let child: SplaySortNode = node
        node = node.parent
        while (node && node.right === child) {
          child = node
          node = node.parent
        }
      }
    }
    for (let index = 0; index < this.entries.length; index += 1) this.entries[index] = this.output[index]!
    this.emit('gather', 'Copy inorder output back to the fixed array', 'Splaying preserves the BST inorder sequence. The output is ascending and equal entries retain their arrival order.', 'array[:] = output[:]', { sortedPrefix: this.entries.length })
  }

  private splay(node: SplaySortNode): void {
    while (node.parent) {
      const parent: SplaySortNode = node.parent
      const grandparent: SplaySortNode | null = parent.parent
      if (!grandparent) this.rotate(node, 'Zig')
      else if ((grandparent.left === parent) === (parent.left === node)) {
        this.rotate(parent, 'Zig-zig: rotate the parent')
        this.rotate(node, 'Zig-zig: rotate the inserted node')
      } else {
        this.rotate(node, 'Zig-zag: first rotation')
        this.rotate(node, 'Zig-zag: second rotation')
      }
    }
    this.step('pass', 'The inserted node is now the root', 'Splaying restructures the search path after every insertion. It does not require cached heights or balance factors.', 'finish splaying inserted node', node)
  }

  private rotate(node: SplaySortNode, label: string): void {
    const parent = node.parent!
    const grandparent = parent.parent
    if (parent.left === node) {
      parent.left = node.right
      if (node.right) node.right.parent = parent
      node.right = parent
    } else {
      parent.right = node.left
      if (node.left) node.left.parent = parent
      node.left = parent
    }
    parent.parent = node
    node.parent = grandparent
    if (!grandparent) this.root = node
    else if (grandparent.left === parent) grandparent.left = node
    else grandparent.right = node
    this.step('reverse', label, `Rotate key ${node.entry.value} above key ${parent.entry.value}. Every link is updated before publishing the scene.`, 'rotate child above its parent', node)
  }

  private step(kind: ArraySortEvent['kind'], label: string, detail: string, code: string, active: SplaySortNode, extra: ArraySortFrame = {}): void {
    if (!this.observer) return
    const tree: ArraySortTreeNode[] = []
    for (const node of this.nodes) tree.push({ id: node.entry.id, entry: node.entry, left: node.left?.entry.id ?? null, right: node.right?.entry.id ?? null, status: node === active ? 'CURRENT' : 'SPLAY', active: node === active })
    this.emit(kind, label, detail, code, { tree, treeRoot: this.root?.entry.id, output: this.output ? [...this.output] : undefined, ...extra })
  }
}
