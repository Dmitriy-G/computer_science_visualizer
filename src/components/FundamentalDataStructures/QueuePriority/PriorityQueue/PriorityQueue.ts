import { BinaryPriorityHeap } from '../../../../visualization/BinaryPriorityHeap.ts'
import { LinearModel } from '../../../../visualization/LinearModel.ts'
import type { LinearInputValues, LinearObserver, LinearResult } from '../../../../visualization/LinearModel.ts'
import type { ActionKind } from '../../../../visualization/ActionCatalog.ts'

export class PriorityQueue extends BinaryPriorityHeap {
  public readonly kind = 'priority-queue'
  public get hint(): string { return 'A binary min-heap stores value/priority pairs. Smaller numeric priorities leave first; equal priorities preserve FIFO insertion order. This example allows 64 entries.' }

  public static createDefault(): PriorityQueue {
    const model = new PriorityQueue()
    for (let index = 0; index < 10; index += 1) model.execute('enqueue', { value: (index + 1) * 10, priority: [4, 2, 7, 1, 2, 9, 3, 6, 8, 5][index] })
    return model
  }

  public clone(): PriorityQueue {
    const model = new PriorityQueue()
    this.copyTo(model)
    return model
  }

  public execute(action: ActionKind, input: LinearInputValues, observer?: LinearObserver): LinearResult {
    if (action === 'peek') return this.peekResult()
    if (action === 'enqueue') {
      const value = LinearModel.integer(input, 'value')
      const priority = LinearModel.integer(input, 'priority')
      const entry = this.append(value, priority, observer)
      return { description: entry ? `Enqueued ${value} with priority ${priority}; equal priorities retain FIFO order.` : 'Enqueue rejected: this example allows 64 entries.', activeId: entry?.id }
    }
    if (action === 'dequeue') {
      if (!this.length) return { description: 'The priority queue is empty; nothing dequeued.', value: null }
      const removed = this.removeAt(0, observer)
      return { description: `Dequeued ${removed.value} with priority ${removed.priority}.`, value: removed.value, activeId: this.entries[0]?.id }
    }
    if (action !== 'clear') throw new RangeError('Unsupported priority-queue action')
    while (this.entries.length) {
      this.entries.pop()
      this.trace(observer, null, 'Release the last heap entry; the remaining heap order is preserved.', 'heap.pop()')
    }
    return { description: 'The priority queue is empty.' }
  }
}
