import { ArraySortOperations } from './ArraySortOperations.ts'
import type { ArrayEntry } from '../../../DataStructuresOverview/Linear/Array/FixedArray.ts'
import type { ArraySortTreeNode } from './ArraySortTrace.ts'

class SortTreeNode {
  public readonly entry: ArrayEntry
  public readonly source: number
  public readonly parent: SortTreeNode | null
  public left: SortTreeNode | null = null
  public right: SortTreeNode | null = null

  constructor(entry: ArrayEntry, source: number, parent: SortTreeNode | null) {
    this.entry = entry
    this.source = source
    this.parent = parent
  }
}

// An unbalanced BST with one node per entry; equal keys always descend right.
export class TreeArraySort extends ArraySortOperations {
  private root: SortTreeNode | null = null

  public sort(): void {
    if (this.entries.length < 2) return
    for (let index = 0; index < this.entries.length; index += 1) {
      const entry = this.entries[index]
      let parent: SortTreeNode | null = null
      let current: SortTreeNode | null = this.root
      while (current) {
        parent = current
        this.emit('compare', 'Descend the search tree', `Insert key ${entry.value}: values smaller than ${current.entry.value} go left; equal or larger values go right.`, `${entry.value} < ${current.entry.value} ? left : right`, { activeIndices: [index, current.source], tree: this.snapshot(current), treeRoot: this.root!.entry.id }, index, current.source)
        current = entry.value < current.entry.value ? current.left : current.right
      }
      const node = new SortTreeNode(entry, index, parent)
      if (!parent) this.root = node
      else if (entry.value < parent.entry.value) parent.left = node
      else parent.right = node
      this.emit('place', 'Attach the entry to the BST', `Store key ${entry.value} in its own search-tree node. Equal keys keep their arrival order along rightward search paths.`, 'attach node under its search parent', { activeIndices: [index], tree: this.snapshot(node), treeRoot: this.root!.entry.id }, index)
    }
    // Parent links allow inorder traversal without recursion, even on a chain.
    let node: SortTreeNode | null = this.root
    while (node?.left) node = node.left
    let destination = 0
    while (node) {
      this.entries[destination] = node.entry
      this.emit('write', 'Read the next inorder entry', `Write key ${node.entry.value} to array index ${destination}. Inorder traversal visits every BST entry in ascending order.`, `array[${destination}] = inorder.next()`, { unwrittenFrom: destination + 1, sortedPrefix: destination + 1, tree: this.snapshot(node), treeRoot: this.root!.entry.id }, destination)
      destination += 1
      if (node.right) {
        node = node.right
        while (node.left) node = node.left
      } else {
        let child: SortTreeNode = node
        node = node.parent
        while (node && node.right === child) {
          child = node
          node = node.parent
        }
      }
    }
  }

  private snapshot(active: SortTreeNode): ArraySortTreeNode[] | undefined {
    if (!this.observer) return undefined
    const nodes: ArraySortTreeNode[] = []
    const pending = this.root ? [this.root] : []
    while (pending.length) {
      const node = pending.pop()!
      nodes.push({ id: node.entry.id, entry: node.entry, left: node.left?.entry.id ?? null, right: node.right?.entry.id ?? null, status: node === active ? 'CURRENT' : 'BST', active: node === active })
      if (node.right) pending.push(node.right)
      if (node.left) pending.push(node.left)
    }
    return nodes
  }
}
