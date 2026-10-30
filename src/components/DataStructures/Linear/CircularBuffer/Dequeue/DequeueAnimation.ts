import { CircularBuffer } from '../CircularBuffer.ts'
import type { CircularBufferEntry } from '../CircularBuffer.ts'
import { CircularBufferLayout } from '../CircularBufferLayout.ts'
import { AnimationSequence } from '../../../../../visualization/AnimationSequence.ts'

export class DequeueAnimation extends AnimationSequence {
  public readonly result: CircularBuffer

  public static describe(size: number) {
    return AnimationSequence.information(
      'Dequeue', 'Read and release the oldest slot, then advance read.', size,
      ['O(1)', 'O(1)', 'O(1)'],
      'Every case checks count, releases at most one slot, and advances read in O(1). Empty inputs return no value.',
      'O(1)', 'A fixed number of pointers, indices, and saved values. Existing buffer slots require no additional allocation.',
      [
        { symbol: 'capacity', meaning: 'The fixed number of physical slots allocated for this buffer.' },
        { symbol: '%', meaning: 'Remainder: (index + 1) % capacity wraps the last physical index back to zero.' },
      ],
    )
  }

  public readonly removed: CircularBufferEntry | null

  constructor(model: CircularBuffer) {
    super()
    this.result = model.clone()
    this.removed = this.result.dequeue()
    const layout = new CircularBufferLayout()
    const frame = { count: model.length, activeSlot: model.readIndex }
    this.add(1, 'Inspect the read slot', 'Read always identifies the oldest occupied slot. Count distinguishes empty from full when the indices coincide.', 'if count == 0: return empty', layout.create(model, frame))
    if (this.removed) {
      this.add(2, 'Read the oldest value', `Save ${this.removed.value} from physical slot ${this.removed.slot}.`, 'value = slots[read]', layout.create(model, { ...frame, activeId: this.removed.id, activeStatus: 'READ' }))
      this.add(3, 'Release the occupied slot', 'Release the saved value from its physical slot. Other values stay in their slots.', 'slots[read] = empty', layout.create(this.result, { count: model.length, readIndex: model.readIndex, activeSlot: this.removed.slot }))
      this.add(4, 'Advance read with wraparound', `Read advances from ${model.readIndex} to ${this.result.readIndex}, wrapping after the last slot. The write index stays fixed.`, `read = (read + 1) % ${model.capacity}`, layout.create(this.result, { count: model.length, activeSlot: this.result.readIndex }))
    }
    this.add(5, this.removed ? 'Dequeue complete' : 'Buffer is empty', this.removed ? `Returned ${this.removed.value}. The buffer now contains ${this.result.length} values.` : 'There is no oldest value to remove. The buffer remains empty.', this.removed ? 'count -= 1\nreturn value' : 'return empty', layout.create(this.result))
  }
}
