import { SetUnionModel } from '../SetUnionModel.ts'
import { AVLTree } from '../../Trees/AVLTree/AVLTree.ts'
import type { AVLTreeEntry } from '../../Trees/AVLTree/AVLTree.ts'
import type { ActionKind } from '../../../../visualization/ActionCatalog.ts'
import type { LinearInputValues, LinearObserver, LinearResult } from '../../../../visualization/LinearModel.ts'

// An ordered set has the same unique-key storage and repairs as an AVL tree.
export class OrderedSet extends SetUnionModel {
  public readonly kind = 'ordered-set'
  private storage = new AVLTree()
  public get length(): number { return this.storage.length }
  public getEntries(): AVLTreeEntry[] { return this.storage.getEntries() }

  public static createDefault(): OrderedSet {
    const model = new OrderedSet()
    for (let value = 10; value <= 100; value += 10) model.execute('insert', { value })
    return model
  }

  public clone(): OrderedSet {
    const copy = new OrderedSet()
    copy.storage = this.storage.clone()
    return copy
  }

  public execute(action: ActionKind, input: LinearInputValues, observer?: LinearObserver): LinearResult {
    const trace = this.treeObserver(observer)
    if (action === 'clear') {
      this.storage.clear(trace)
      return { description: 'Released all ordered-set keys in postorder.' }
    }
    const value = SetUnionModel.integer(input, 'value')
    if (action === 'insert') {
      if (this.storage.find(value)) return this.reject(`${value} is already present; duplicate insertion leaves the set unchanged.`)
      if (this.length >= SetUnionModel.maximumElements) return this.reject('The ordered set allows at most 64 keys.')
      this.storage.insert(value, trace)
      const entry = this.storage.find(value)!
      return { description: `Added ${value}; rotations preserve strict key order and AVL balance.`, activeId: entry.id, value }
    }
    if (action === 'delete-value') {
      const removed = this.storage.deleteValue(value, trace)
      return { description: removed ? `Removed ${value} and repaired AVL balance.` : `${value} was absent; the ordered set is unchanged.`, value: removed }
    }
    if (action !== 'search-value' && action !== 'lower-bound') throw new RangeError('Unsupported ordered-set action')
    const found = action === 'lower-bound' ? this.storage.lowerBound(value, trace) : this.storage.find(value, trace)
    return {
      description: action === 'lower-bound'
        ? found ? `Lower bound of ${value}: ${found.value}, the smallest stored key at least ${value}.` : `No stored key is at least ${value}.`
        : `${value} is ${found ? 'present' : 'absent'} in the ordered set.`,
      activeId: found?.id, status: found ? 'FOUND' : 'ABSENT', value: action === 'lower-bound' ? found?.value ?? null : found !== null,
    }
  }
}
