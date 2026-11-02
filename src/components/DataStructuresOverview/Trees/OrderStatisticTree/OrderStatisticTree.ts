import { SearchTreeModel, SearchTreeNode } from '../SearchTreeModel.ts'
import type { ActionKind } from '../../../../visualization/ActionCatalog.ts'
import type { TreeInputValues, TreeOperationResult } from '../../../../visualization/AdditionalTreeModel.ts'
import { AdditionalTreeModel } from '../../../../visualization/AdditionalTreeModel.ts'
import type { TreeTraceObserver } from '../../../../visualization/TreeTrace.ts'
export class OrderStatisticTree extends SearchTreeModel {
  public readonly kind = 'order-statistic-tree'
  protected empty(): OrderStatisticTree { return new OrderStatisticTree() }
  protected metadata(node: SearchTreeNode): string { return `size ${node.size}; height ${node.height}` }
  public static createDefault(): OrderStatisticTree {
    const tree = new OrderStatisticTree()
    for (const key of [50, 20, 80, 10, 30, 60, 90, 40, 70, 100]) tree.insertKey(key)
    return tree
  }
  private balance(start: SearchTreeNode | null, observer?: TreeTraceObserver): void {
    let node = start
    while (node) {
      this.refresh(node)
      const difference = (node.left?.height ?? 0) - (node.right?.height ?? 0)
      if (difference > 1) {
        if ((node.left!.left?.height ?? 0) < (node.left!.right?.height ?? 0)) this.rotate(node.left!, 'left', observer)
        node = this.rotate(node, 'right', observer)
      } else if (difference < -1) {
        if ((node.right!.right?.height ?? 0) < (node.right!.left?.height ?? 0)) this.rotate(node.right!, 'right', observer)
        node = this.rotate(node, 'left', observer)
      }
      node = node.parent
    }
  }
  protected insertKey(key: number, observer?: TreeTraceObserver): void { this.balance(this.attach(key, observer), observer) }
  protected deleteKey(node: SearchTreeNode, observer?: TreeTraceObserver): void { this.balance(this.detach(node, observer), observer) }
  public execute(action: ActionKind, input: TreeInputValues, observer?: TreeTraceObserver): TreeOperationResult {
    if (action !== 'rank' && action !== 'select-rank') return super.execute(action, input, observer)
    let node = this.root
    let rank = action === 'select-rank' ? this.index(input, 'rank') : 0
    const key = action === 'rank' ? AdditionalTreeModel.integer(input, 'key') : 0
    while (node) {
      const leftSize = node.left?.size ?? 0
      this.emit(observer, node.id, `Left subtree contains ${leftSize} keys.`, 'compare rank with left.size', 'compare')
      if (action === 'rank') {
        if (key <= node.key) node = node.left
        else {
          rank += leftSize + 1
          node = node.right
        }
      } else if (rank === leftSize) return { description: `Rank ${input.rank} (zero-based) is key ${node.key} at ${node.id}.`, returnValue: node.key, activeId: node.id, status: 'FOUND'
    }
      else if (rank < leftSize) node = node.left
      else {
        rank -= leftSize + 1
        node = node.right
      }
    }
    return { description: `${rank} stored keys are strictly smaller than ${key}.`, returnValue: rank }
  }
}
