import { SearchTreeModel, SearchTreeNode } from '../SearchTreeModel.ts'
import type { TreeTraceObserver } from '../../../../visualization/TreeTrace.ts'
export class Treap extends SearchTreeModel {
  public readonly kind = 'treap'
  private seed = 0x6d2b79f5
  protected empty(): Treap { return new Treap() }
  protected copyPolicy(copy: SearchTreeModel): void { (copy as Treap).seed = this.seed }
  protected metadata(node: SearchTreeNode): string { return `priority ${node.priority}; size ${node.size}` }
  public static createDefault(): Treap {
    const tree = new Treap()
    for (const key of [50, 20, 80, 10, 30, 60, 90, 40, 70, 100]) tree.insertKey(key)
    return tree
  }
  protected insertKey(key: number, observer?: TreeTraceObserver): void {
    this.capacity()
    // Fixed seed makes playback reproducible; expected bounds assume independent priorities.
    this.seed ^= this.seed << 13
    this.seed ^= this.seed >>> 17
    this.seed ^= this.seed << 5
    const node = this.attach(key)
    node.priority = this.seed >>> 0
    this.emit(observer, node.id, `Assign seeded priority ${node.priority}.`, 'insert BST leaf with seeded priority', 'connect')
    while (node.parent && node.parent.priority > node.priority) this.rotate(node.parent, node.parent.left === node ? 'right' : 'left', observer)
  }
  protected deleteKey(node: SearchTreeNode, observer?: TreeTraceObserver): void {
    while (node.left || node.right) {
      const direction = !node.right || (node.left && node.left.priority <= node.right.priority) ? 'right' : 'left'
      this.rotate(node, direction, observer)
    }
    this.detach(node, observer)
  }
}
