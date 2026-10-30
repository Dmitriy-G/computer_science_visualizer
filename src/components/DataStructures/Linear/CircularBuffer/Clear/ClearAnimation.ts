import { CircularBuffer } from '../CircularBuffer.ts'
import { CircularBufferLayout } from '../CircularBufferLayout.ts'
import { AnimationSequence } from '../../../../../visualization/AnimationSequence.ts'

export class ClearAnimation extends AnimationSequence {
  public readonly result: CircularBuffer

  public static describe(size: number) {
    return AnimationSequence.information(
      'Clear', 'Release occupied slots in FIFO order.', size,
      ['O(n)', 'O(n)', 'O(n)'],
      'For the same nonempty input size, every case explicitly releases all n values in logical order. Empty inputs return immediately.',
      'O(1)', 'A fixed number of pointers, indices, and saved values. Existing buffer slots require no additional allocation.',
      [
        { symbol: 'capacity', meaning: 'The fixed number of physical slots allocated for this buffer.' },
        { symbol: '%', meaning: 'Remainder: (index + 1) % capacity wraps the last physical index back to zero.' },
      ],
    )
  }

  constructor(model: CircularBuffer) {
    super()
    this.result = model.clone()
    const layout = new CircularBufferLayout()
    const frame = { count: model.length }
    this.add(1, 'Inspect the structure', 'Clear releases one node or occupied slot at a time. Empty inputs require no removals.', 'while count > 0:', layout.create(model, frame))
    while (!this.result.isEmpty()) {
      const current = this.result.peek()
      this.add(2, `Release value ${current!.value}`, 'Release the value at read, then continue in logical FIFO order with wraparound.', 'value = slots[read]\nslots[read] = empty', layout.create(this.result, { ...frame, activeId: current?.id, activeSlot: current?.slot, activeStatus: 'RELEASING' }))
      this.result.dequeue()
      this.add(2, 'Advance to the next value', 'The removed value has been released; the scene count stays uncommitted until the end.', 'read = (read + 1) % capacity', layout.create(this.result, frame))
    }
    this.add(3, 'Clear complete', 'All values have been released. The structure is empty and can be used again.', 'count = 0\nwrite = read', layout.create(this.result))
  }
}
