import { SearchTreeModel, SearchTreeNode } from '../../../../visualization/SearchTreeModel.ts'
import { AdditionalTreeModel } from '../../../../visualization/AdditionalTreeModel.ts'
import type { TreeInputValues, TreeOperationResult } from '../../../../visualization/AdditionalTreeModel.ts'
import type { ActionKind } from '../../../../visualization/ActionCatalog.ts'
import type { TreeTraceObserver } from '../../../../visualization/TreeTrace.ts'
// Reuses binary links and metadata only: values have no search ordering.
export class UnorderedBinaryTree extends SearchTreeModel {
  public readonly kind = 'unordered-binary-tree'
  protected empty(): UnorderedBinaryTree { return new UnorderedBinaryTree() }
  public static createDefault(): UnorderedBinaryTree {
    const tree = new UnorderedBinaryTree()
    tree.execute('insert', { key: 50, parent: 50, side: 0 })
    for (const [key, parent, side] of [[80, 50, 0], [20, 50, 1], [90, 80, 0], [10, 80, 1], [70, 20, 0], [30, 20, 1], [100, 90, 0], [40, 90, 1], [60, 10, 1]]) tree.execute('insert', { key, parent, side })
    return tree
  }
  protected locate(key: number, observer?: TreeTraceObserver): SearchTreeNode | null {
    const stack: SearchTreeNode[] = this.root ? [this.root] : []
    while (stack.length) {
      const node = stack.pop()!
      this.emit(observer, node.id, `Compare with ${node.key}; there is no ordering shortcut.`, 'DFS: inspect node, left, right', 'compare')
      if (node.key === key) return node
      if (node.right) stack.push(node.right)
      if (node.left) stack.push(node.left)
    }
    return null
  }
  public execute(action: ActionKind, input: TreeInputValues, observer?: TreeTraceObserver): TreeOperationResult {
    if (action !== 'insert' && action !== 'delete-value') return super.execute(action, input, observer)
    const key = AdditionalTreeModel.integer(input, 'key')
    const found = this.locate(key, observer)
    if (action === 'delete-value') {
      if (!found) return { description: 'Key absent; no subtree removed.' }
      const size = found.size
      const parent = found.parent
      if (!parent) this.root = null
      else if (parent.left === found) parent.left = null
      else parent.right = null
      this.count -= size
      this.refreshUp(parent)
      this.emit(observer, parent?.id ?? null, `Remove the selected subtree of ${size} nodes.`, 'detach selected subtree', 'remove')
      return { description: `Removed ${key} and all its descendants (${size} nodes).` }
    }
    if (found) return { description: 'Duplicate key rejected.', activeId: found.id }
    this.capacity()
    const parentKey = AdditionalTreeModel.integer(input, 'parent')
    const side = AdditionalTreeModel.integer(input, 'side')
    if (side !== 0 && side !== 1) throw new RangeError('Side must be 0 (left) or 1 (right)')
    const parent = this.root ? this.locate(parentKey, observer) : null
    if (this.root && !parent) throw new RangeError('Parent key does not exist')
    if (parent && (side === 0 ? parent.left : parent.right)) throw new RangeError('That child position is occupied')
    const node = new SearchTreeNode(this.allocateId(), key)
    node.parent = parent
    if (!parent) this.root = node
    else if (side === 0) parent.left = node
    else parent.right = node
    this.count += 1
    this.refreshUp(node)
    this.emit(observer, node.id, `Attach ${key} to the requested child position.`, 'parent[side] = newNode', 'connect')
    return { description: `Inserted ${key}; no key ordering is imposed.`, activeId: node.id }
  }
}
