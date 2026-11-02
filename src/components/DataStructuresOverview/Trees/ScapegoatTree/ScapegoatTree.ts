import { SearchTreeModel, SearchTreeNode } from '../SearchTreeModel.ts'
import type { TreeTraceObserver } from '../../../../visualization/TreeTrace.ts'
export class ScapegoatTree extends SearchTreeModel {
  public readonly kind = 'scapegoat-tree'
  private upperSize = 0
  protected empty(): ScapegoatTree { return new ScapegoatTree() }
  protected cleared(): void { this.upperSize = 0 }
  protected copyPolicy(copy: SearchTreeModel): void { (copy as ScapegoatTree).upperSize = this.upperSize }
  public static createDefault(): ScapegoatTree {
    const tree = new ScapegoatTree()
    for (const key of [10, 20, 30, 40, 50, 60, 70, 80, 90, 100]) tree.insertKey(key)
    return tree
  }
  private rebuild(node: SearchTreeNode, observer?: TreeTraceObserver): void {
    const parent = node.parent
    const wasLeft = parent?.left === node
    const nodes: SearchTreeNode[] = []
    const collect = (current: SearchTreeNode | null): void => {
      if (!current) return
      collect(current.left)
      nodes.push(current)
      collect(current.right)
    }
    collect(node)
    const build = (start: number, end: number, ancestor: SearchTreeNode | null): SearchTreeNode | null => {
      if (start >= end) return null
      const mid = Math.floor((start + end) / 2)
      const current = nodes[mid]
      current.parent = ancestor
      current.left = build(start, mid, current)
      current.right = build(mid + 1, end, current)
      this.refresh(current)
      return current
    }
    const rebuilt = build(0, nodes.length, parent)
    if (!parent) this.root = rebuilt
    else if (wasLeft) parent.left = rebuilt
    else parent.right = rebuilt
    this.refreshUp(parent)
    this.emit(observer, rebuilt?.id ?? null, 'Rebuild the scapegoat subtree around inorder medians.', 'rebuild(unbalancedSubtree)', 'rotate')
  }
  protected insertKey(key: number, observer?: TreeTraceObserver): void {
    const node = this.attach(key, observer)
    this.upperSize += 1
    let depth = 0
    let current = node
    while (current.parent) {
      current = current.parent
      depth += 1
    }
    if (depth <= Math.log(this.upperSize) / Math.log(1.5)) return
    current = node
    while (current.parent && 3 * current.size <= 2 * current.parent.size) current = current.parent
    if (current.parent) this.rebuild(current.parent, observer)
  }
  protected deleteKey(node: SearchTreeNode, observer?: TreeTraceObserver): void {
    this.detach(node, observer)
    if (2 * this.count < this.upperSize) {
      if (this.root) this.rebuild(this.root, observer)
      this.upperSize = this.count
    }
  }
}
