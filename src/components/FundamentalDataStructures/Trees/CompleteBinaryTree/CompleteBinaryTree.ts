import { ExtendedTreeModel } from '../../../../visualization/ExtendedTreeModel.ts'
import { AdditionalTreeModel } from '../../../../visualization/AdditionalTreeModel.ts'
import type { TreeDiagramEntry, TreeInputValues, TreeOperationResult } from '../../../../visualization/AdditionalTreeModel.ts'
import type { ActionKind } from '../../../../visualization/ActionCatalog.ts'
import type { TreeTraceObserver } from '../../../../visualization/TreeTrace.ts'
export class CompleteBinaryTree extends ExtendedTreeModel {
  public readonly kind = 'complete-binary-tree'
  private nodes: { id: string
    key: number }[] = []
  public get length(): number { return this.nodes.length }
  public static createDefault(): CompleteBinaryTree {
    const tree = new CompleteBinaryTree()
    for (const key of [50, 80, 20, 90, 10, 70, 30, 100, 40, 60]) tree.execute('insert', { key })
    return tree
  }
  public clone(): CompleteBinaryTree {
    const tree = new CompleteBinaryTree()
    for (const node of this.nodes) tree.nodes.push({ ...node })
    tree.nextId = this.nextId
    return tree
  }
  public getDiagram(): TreeDiagramEntry[] {
    const result: TreeDiagramEntry[] = []
    for (let index = 0; index < this.nodes.length; index += 1) {
      const children: string[] = []
      for (const child of [2 * index + 1, 2 * index + 2]) if (this.nodes[child]) children.push(this.nodes[child].id)
      result.push({ id: this.nodes[index].id, text: String(this.nodes[index].key), label: `level-order index ${index}`, children, width: Math.max(110, String(this.nodes[index].key).length * 10 + 24) })
    }
    return result
  }
  public execute(action: ActionKind, input: TreeInputValues, observer?: TreeTraceObserver): TreeOperationResult {
    if (action === 'clear') {
      while (this.nodes.length) {
        this.nodes.pop()
        this.emit(observer, this.nodes.at(-1)?.id ?? null, 'Release the last level-order node.', 'nodes.pop()', 'remove')
      }
      return { description: 'The complete binary tree is empty.' }
    }
    const key = AdditionalTreeModel.integer(input, 'key')
    if (action === 'insert') {
      this.capacity()
      const node = { id: this.allocateId(), key }
      this.nodes.push(node)
      this.emit(observer, node.id, 'Fill the next level-order position; heap order is not required.', 'nodes.push(newNode)', 'connect')
      return { description: `Appended ${key} at index ${this.length - 1}.`, activeId: node.id }
    }
    let index = 0
    for (; index < this.nodes.length; index += 1) {
      this.emit(observer, this.nodes[index].id, `Inspect index ${index}.`, 'scan level-order nodes', 'compare')
      if (this.nodes[index].key === key) break
    }
    const found = this.nodes[index]
    if (action === 'search-value') return { description: found ? `Found ${key} at level-order index ${index}.` : `${key} is absent.`, returnValue: !!found, activeId: found?.id, status: found ? 'FOUND' : 'ABSENT' }
    if (action !== 'delete-value') throw new RangeError('Unsupported complete-tree action')
    if (!found) return { description: 'Value absent; tree unchanged.' }
    const last = this.nodes.pop()!
    if (index < this.length) this.nodes[index].key = last.key
    this.emit(observer, this.nodes[index]?.id ?? null, 'Replace the first match with the deepest rightmost value.', 'target.key = last.key; remove last', 'remove')
    return { description: `Removed the first ${key}; completeness is preserved.` }
  }
}
