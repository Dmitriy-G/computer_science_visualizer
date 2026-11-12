import { SearchTreeModel, SearchTreeNode } from '../../../../visualization/SearchTreeModel.ts'
import type { TreeTraceObserver } from '../../../../visualization/TreeTrace.ts'
export class SplayTree extends SearchTreeModel {
  public readonly kind = 'splay-tree'
  protected empty(): SplayTree { return new SplayTree() }
  public static createDefault(): SplayTree {
    const tree = new SplayTree()
    for (const key of [50, 20, 80, 10, 30, 60, 90, 40, 70, 100]) tree.insertKey(key)
    return tree
  }
  private splay(node: SearchTreeNode, observer?: TreeTraceObserver): void {
    while (node.parent) {
      const parent = node.parent
      const grandparent = parent.parent
      const left = node === parent.left
      if (!grandparent) this.rotate(parent, left ? 'right' : 'left', observer)
      else if ((parent === grandparent.left) === left) {
        this.rotate(grandparent, left ? 'right' : 'left', observer)
        this.rotate(parent, left ? 'right' : 'left', observer)
      } else {
        this.rotate(parent, left ? 'right' : 'left', observer)
        this.rotate(grandparent, left ? 'left' : 'right', observer)
      }
    }
  }
  protected insertKey(key: number, observer?: TreeTraceObserver): void { this.splay(this.attach(key, observer), observer) }
  protected accessKey(key: number, observer?: TreeTraceObserver): SearchTreeNode | null {
    let node = this.root
    let last = node
    while (node) {
      last = node
      this.emit(observer, node.id, `Compare ${key} with ${node.key}.`, 'compare; descend toward key', 'compare')
      if (key === node.key) break
      node = key < node.key ? node.left : node.right
    }
    if (last) this.splay(last, observer)
    return node
  }
  protected deleteKey(node: SearchTreeNode, observer?: TreeTraceObserver): void {
    this.splay(node, observer)
    const left = node.left
    const right = node.right
    if (left) left.parent = null
    if (right) right.parent = null
    this.root = left
    this.count -= 1
    if (left) {
      let maximum = left
      while (maximum.right) maximum = maximum.right
      this.splay(maximum)
      maximum.right = right
      if (right) right.parent = maximum
      this.refresh(maximum)
    } else this.root = right
    this.emit(observer, this.root?.id ?? null, 'Join the left maximum with the right subtree.', 'splay(max(left)); root.right = right', 'connect')
  }
}
