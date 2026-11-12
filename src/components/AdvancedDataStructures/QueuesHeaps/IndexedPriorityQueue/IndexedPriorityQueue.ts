import { BinaryPriorityHeap } from '../../../../visualization/BinaryPriorityHeap.ts'
import type { PriorityEntry } from '../../../../visualization/BinaryPriorityHeap.ts'
import { LinearModel } from '../../../../visualization/LinearModel.ts'
import type { LinearInputValues, LinearObserver, LinearResult } from '../../../../visualization/LinearModel.ts'
import type { ActionKind } from '../../../../visualization/ActionCatalog.ts'

export class IndexedPriorityQueue extends BinaryPriorityHeap {
  public readonly kind = 'indexed-priority-queue'
  private readonly positions = new Map<number, number>()

  public static createDefault(): IndexedPriorityQueue {
    const model = new IndexedPriorityQueue()
    for (let key = 0; key < 10; key += 1) model.execute('insert', { key, priority: [40, 20, 70, 10, 50, 90, 30, 60, 80, 100][key] })
    return model
  }

  protected moved(entry: PriorityEntry, index: number): void { this.positions.set(entry.key!, index) }
  public getPositions(): ReadonlyMap<number, number> { return new Map(this.positions) }
  public clone(): IndexedPriorityQueue {
    const model = new IndexedPriorityQueue()
    this.copyTo(model)
    return model
  }

  public execute(action: ActionKind, input: LinearInputValues, observer?: LinearObserver): LinearResult {
    if (action === 'peek') return this.peekResult()
    if (action === 'clear') {
      while (this.entries.length) {
        const entry = this.entries.pop()!
        this.positions.delete(entry.key!)
        this.trace(observer, null, `Release key ${entry.key} and its inverse-position entry.`, 'positions.delete(key); heap.pop()')
      }
      return { description: 'Both the heap and inverse-position Map are empty.' }
    }
    if (action === 'extract-min') {
      if (!this.length) return { description: 'The indexed priority queue is empty.', value: null }
      const removed = this.removeAt(0, observer)
      this.positions.delete(removed.key!)
      return { description: `Extracted key ${removed.key}, priority ${removed.priority}.`, value: removed.key, activeId: this.entries[0]?.id }
    }
    const key = LinearModel.integer(input, 'key')
    const index = this.positions.get(key)
    if (action === 'insert') {
      const priority = LinearModel.integer(input, 'priority')
      if (index !== undefined) return { description: `Key ${key} already exists; insertion rejected.`, activeId: this.entries[index].id, status: 'DUPLICATE' }
      const entry = this.append(key, priority, observer, key)
      return { description: entry ? `Inserted key ${key} with priority ${priority}.` : 'Insertion rejected: this example allows 64 keys.', activeId: entry?.id }
    }
    if (index === undefined) return { description: `Key ${key} is absent; nothing changed.`, status: 'NOT FOUND' }
    if (action === 'change-priority') {
      const priority = LinearModel.integer(input, 'priority')
      const entry = this.entries[index]
      const previous = entry.priority
      entry.priority = priority
      this.trace(observer, entry.id, `Change key ${key} from priority ${previous} to ${priority}.`, 'heap[positions[key]].priority = newPriority')
      if (priority < previous) this.up(index, observer)
      else this.down(index, observer)
      return { description: `Key ${key} now has priority ${priority}; inverse positions repaired.`, activeId: entry.id }
    }
    if (action !== 'delete-value') throw new RangeError('Unsupported indexed priority-queue action')
    const removed = this.removeAt(index, observer)
    this.positions.delete(key)
    return { description: `Deleted key ${key} directly through its heap position.`, value: removed.key }
  }
}
