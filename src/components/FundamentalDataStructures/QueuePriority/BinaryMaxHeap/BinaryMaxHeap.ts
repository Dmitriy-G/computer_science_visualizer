import { BinaryPriorityHeap } from '../../../../visualization/BinaryPriorityHeap.ts'
import { LinearModel } from '../../../../visualization/LinearModel.ts'
import type { LinearInputValues, LinearObserver, LinearResult } from '../../../../visualization/LinearModel.ts'
import type { ActionKind } from '../../../../visualization/ActionCatalog.ts'

export class BinaryMaxHeap extends BinaryPriorityHeap {
  public readonly kind = 'binary-max-heap'
  protected readonly maximum = true
  public get hint(): string { return 'A complete binary max-heap: every parent is at least as large as either child. Insert sifts upward; extracting the maximum replaces the root with the last leaf and sifts downward. Up to 64 values.' }

  public static createDefault(): BinaryMaxHeap {
    const model = new BinaryMaxHeap()
    for (const value of [40, 20, 70, 10, 50, 90, 30, 60, 80, 100]) model.execute('insert', { value })
    return model
  }

  public clone(): BinaryMaxHeap {
    const model = new BinaryMaxHeap()
    this.copyTo(model)
    return model
  }

  public execute(action: ActionKind, input: LinearInputValues, observer?: LinearObserver): LinearResult {
    if (action === 'peek') return this.peekResult()
    if (action === 'insert') {
      const value = LinearModel.integer(input, 'value')
      const entry = this.append(value, value, observer)
      return { description: entry ? `Inserted ${value}; max-heap order restored.` : 'Insertion rejected: this example allows 64 values.', activeId: entry?.id }
    }
    if (action === 'extract-max') {
      if (!this.length) return { description: 'The max-heap is empty.', value: null }
      const removed = this.removeAt(0, observer)
      return { description: `Extracted maximum ${removed.value}.`, value: removed.value, activeId: this.entries[0]?.id }
    }
    if (action !== 'clear') throw new RangeError('Unsupported max-heap action')
    while (this.entries.length) {
      this.entries.pop()
      this.trace(observer, null, 'Release the last leaf without disturbing remaining heap order.', 'heap.pop()')
    }
    return { description: 'The max-heap is empty.' }
  }
}
