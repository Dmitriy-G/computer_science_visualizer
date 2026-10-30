import { CircularBuffer } from '../CircularBuffer.ts'
import type { CircularBufferEntry } from '../CircularBuffer.ts'
import { CircularBufferLayout } from '../CircularBufferLayout.ts'
import { AnimationSequence } from '../../../../../visualization/AnimationSequence.ts'

export class EnqueueAnimation extends AnimationSequence {
  public readonly result: CircularBuffer

  public static describe(size: number) {
    return AnimationSequence.information(
      'Enqueue', 'Write into the next free slot; reject when full.', size,
      ['O(1)', 'O(1)', 'O(1)'],
      'Every case checks fullness, writes at most one slot, and advances write in O(1). A full buffer rejects enqueue.',
      'O(1)', 'A fixed number of pointers, indices, and saved values. Existing buffer slots require no additional allocation.',
      [
        { symbol: 'capacity', meaning: 'The fixed number of physical slots allocated for this buffer.' },
        { symbol: '%', meaning: 'Remainder: (index + 1) % capacity wraps the last physical index back to zero.' },
      ],
    )
  }

  public readonly inserted: CircularBufferEntry | null

  constructor(model: CircularBuffer, value: number) {
    super()
    this.result = model.clone()
    this.inserted = this.result.enqueue(value)
    const layout = new CircularBufferLayout()
    const frame = { count: model.length, activeSlot: model.writeIndex }
    this.add(1, 'Check available space', `There are ${model.length} occupied slots out of ${model.capacity}. Equal read and write indices mean full only when count equals capacity.`, 'if count == capacity: return full', layout.create(model, frame))
    if (this.inserted) {
      this.add(2, 'Prepare the new value', `The pending value ${value} will use physical slot ${this.inserted.slot}. The buffer has fixed capacity.`, 'slot = write', layout.create(model, { ...frame, pending: this.inserted }))
      this.add(3, 'Write into the free slot', 'Place the value in the free slot without moving any existing value.', 'slots[write] = value', layout.create(model, { ...frame, pending: this.inserted, pendingOffset: 0 }))
      this.add(4, 'Advance write with wraparound', `Write advances from ${model.writeIndex} to ${this.result.writeIndex}. After the last physical slot it wraps to zero.`, `write = (write + 1) % ${model.capacity}`, layout.create(this.result, { count: model.length, activeSlot: this.result.writeIndex, activeId: this.inserted.id, activeStatus: 'PENDING / WRITTEN', activeTone: 'new' }))
    } else {
      this.add(2, 'Buffer is full', 'Reject this enqueue. Existing values, read/write indices, and capacity stay unchanged; this buffer never overwrites the oldest value.', 'return full', layout.create(model, frame))
    }
    this.add(5, this.inserted ? 'Enqueue complete' : 'Enqueue rejected', this.inserted ? `Added ${value}. The buffer contains ${this.result.length} of ${model.capacity} slots.` : 'No value was added. Dequeue a value to free a slot.', this.inserted ? 'count += 1' : 'return full', layout.create(this.result))
  }
}
