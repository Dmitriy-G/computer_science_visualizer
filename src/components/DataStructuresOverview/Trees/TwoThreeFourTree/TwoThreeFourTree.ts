import { ExtendedTreeModel } from '../ExtendedTreeModel.ts'
import { BTree } from '../BTree/BTree.ts'
import { AdditionalTreeModel } from '../../../../visualization/AdditionalTreeModel.ts'
import type { TreeDiagramEntry, TreeInputValues, TreeOperationResult } from '../../../../visualization/AdditionalTreeModel.ts'
import type { ActionKind } from '../../../../visualization/ActionCatalog.ts'
import type { TreeTraceObserver } from '../../../../visualization/TreeTrace.ts'
// A 2-3-4 tree is exactly a minimum-degree-two B-tree, so share that implementation.
export class TwoThreeFourTree extends ExtendedTreeModel {
  public readonly kind = 'two-three-four-tree'
  private tree = new BTree()
  public get length(): number { return this.tree.length }
  public static createDefault(): TwoThreeFourTree {
    const tree = new TwoThreeFourTree()
    tree.tree = BTree.createDefault()
    return tree
  }
  public clone(): TwoThreeFourTree {
    const copy = new TwoThreeFourTree()
    copy.tree = this.tree.clone()
    return copy
  }
  public getDiagram(): TreeDiagramEntry[] {
    const result: TreeDiagramEntry[] = []
    for (const page of this.tree.getEntries()) result.push({ id: page.id, text: page.keys.join(' | '), label: `${page.keys.length + 1}-node; ${page.leaf ? 'leaf' : 'internal'}`, children: page.childIds, width: Math.max(110, page.keys.join(' | ').length * 10 + 24) })
    return result
  }
  public execute(action: ActionKind, input: TreeInputValues, observer?: TreeTraceObserver): TreeOperationResult {
    if (action === 'clear') {
      this.tree.clear(observer)
      return { description: 'Released all 2-3-4 pages.' }
    }
    const key = AdditionalTreeModel.integer(input, 'key')
    if (action === 'search-value') {
      const found = this.tree.find(key, observer)
      return { description: found ? `Found ${key} in ${found.id}.` : `${key} is absent.`, returnValue: !!found, activeId: found?.id, status: found ? 'FOUND' : 'ABSENT' }
    }
    if (action === 'insert') {
      if (!this.tree.find(key)) this.capacity()
      const inserted = this.tree.insert(key, observer)
      return { description: inserted ? `Inserted ${key}, splitting full 4-nodes before descent.` : 'Duplicate key rejected.' }
    }
    if (action === 'delete-value') return { description: this.tree.deleteValue(key, observer) ? `Deleted ${key}, borrowing or merging on descent.` : 'Key absent; pages unchanged.' }
    throw new RangeError('Unsupported 2-3-4 action')
  }
}
