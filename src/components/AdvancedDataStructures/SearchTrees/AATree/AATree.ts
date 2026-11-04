import { SearchTreeModel, SearchTreeNode } from '../../../../visualization/SearchTreeModel.ts'
import type { TreeTraceObserver } from '../../../../visualization/TreeTrace.ts'
export class AATree extends SearchTreeModel {
  public readonly kind = 'aa-tree'
  protected empty(): AATree { return new AATree() }
  protected metadata(node: SearchTreeNode): string { return `level ${node.level}; size ${node.size}` }
  public static createDefault(): AATree {
    const tree = new AATree()
    for (const key of [50, 20, 80, 10, 30, 60, 90, 40, 70, 100]) tree.insertKey(key)
    return tree
  }
  private skew(node: SearchTreeNode): SearchTreeNode {
    if (node.left?.level !== node.level) return node
    return this.rotate(node, 'right')
  }
  private split(node: SearchTreeNode): SearchTreeNode {
    if (node.right?.right?.level !== node.level) return node
    const pivot = this.rotate(node, 'left')
    pivot.level += 1
    return pivot
  }
  protected insertKey(key: number, observer?: TreeTraceObserver): void {
    let node: SearchTreeNode | null = this.attach(key, observer)
    while (node) {
      node = this.skew(node)
      node = this.split(node)
      this.refresh(node)
      this.emit(observer, node.id, 'Skew left horizontal links; split consecutive right horizontal links.', 'node = split(skew(node))', 'rotate')
      node = node.parent
    }
  }
  protected deleteKey(node: SearchTreeNode, observer?: TreeTraceObserver): void {
    let current = this.detach(node, observer)
    while (current) {
      const level = Math.min(current.left?.level ?? 0, current.right?.level ?? 0) + 1
      if (level < current.level) {
        current.level = level
        if (current.right && current.right.level > level) current.right.level = level
      }
      current = this.skew(current)
      if (current.right) this.skew(current.right)
      if (current.right?.right) this.skew(current.right.right)
      current = this.split(current)
      if (current.right) this.split(current.right)
      this.refresh(current)
      this.emit(observer, current.id, 'Lower levels, then skew and split the affected right spine.', 'decreaseLevel; skew; skew(right); skew(right.right); split; split(right)', 'rotate')
      current = current.parent
    }
  }
}
