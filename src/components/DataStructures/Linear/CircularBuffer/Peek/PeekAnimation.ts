import { CircularBuffer } from '../CircularBuffer.ts'
import type { CircularBufferEntry } from '../CircularBuffer.ts'
import { CircularBufferLayout } from '../CircularBufferLayout.ts'
import { AnimationSequence } from '../../../../../visualization/AnimationSequence.ts'

export class PeekAnimation extends AnimationSequence {
  public readonly result: CircularBuffer

  public static describe(size: number) {
    return AnimationSequence.information(
      'Peek (oldest)', 'Read the oldest value without advancing read.', size,
      ['O(1)', 'O(1)', 'O(1)'],
      'Every case checks count and reads the oldest slot in O(1). Empty inputs return no value.',
      'O(1)', 'A fixed number of pointers, indices, and saved values. Existing buffer slots require no additional allocation.',
    )
  }

  public readonly entry: CircularBufferEntry | null

  constructor(model: CircularBuffer) {
    super()
    this.result = model.clone()
    this.entry = model.peek()
    const layout = new CircularBufferLayout()
    this.add(1, 'Inspect the read index', 'Check emptiness, then read the oldest occupied slot without advancing read.', 'if count == 0: return empty', layout.create(model))
    this.add(2, this.entry ? 'Read the value' : 'The structure is empty', this.entry ? `The value is ${this.entry.value}. Leave every node and pointer unchanged.` : 'There is no value to read. Leave the empty structure unchanged.', 'value = slots[read]', layout.create(model, { activeId: this.entry?.id, activeSlot: model.readIndex, activeStatus: 'READ' }))
    this.add(3, 'Peek complete', this.entry ? `Returned ${this.entry.value} without removing it.` : 'Returned no value because the structure is empty.', this.entry ? 'return value' : 'return empty', layout.create(model, { activeId: this.entry?.id, activeSlot: model.readIndex, activeStatus: 'READ' }))
  }
}
