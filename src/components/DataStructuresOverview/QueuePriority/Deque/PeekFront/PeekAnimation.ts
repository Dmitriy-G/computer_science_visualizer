import { Deque } from '../Deque.ts'
import type { DequeEntry } from '../Deque.ts'
import { DequeLayout } from '../DequeLayout.ts'
import { AnimationSequence } from '../../../../../visualization/AnimationSequence.ts'

export class PeekAnimation extends AnimationSequence {
  public readonly result: Deque

  public static describe(size: number) {
    return AnimationSequence.information(
      'Peek front', 'Read the front without removing it.', size,
      ['O(1)', 'O(1)', 'O(1)'],
      'Every case reads or changes a fixed number of cached end pointers and nodes, independent of n. Empty inputs are checked before reading.',
      'O(1)', 'A fixed number of pointers and saved values; no replacement list or traversal collection is allocated by the operation.',
    )
  }

  public readonly entry: DequeEntry | null

  constructor(model: Deque) {
    super()
    this.result = model.clone()
    this.entry = model.peekFront()
    const layout = new DequeLayout()
    const entries = model.getEntries()
    this.add(1, 'Inspect the cached end', 'Check emptiness, then read the end pointer without traversing.', 'if count == 0: return empty', layout.create(entries))
    this.add(2, this.entry ? 'Read the value' : 'The structure is empty', this.entry ? `The value is ${this.entry.value}. Leave every node and pointer unchanged.` : 'There is no value to read. Leave the empty structure unchanged.', 'value = front.value', layout.create(entries, { activeId: this.entry?.id, activeStatus: 'READ' }))
    this.add(3, 'Peek complete', this.entry ? `Returned ${this.entry.value} without removing it.` : 'Returned no value because the structure is empty.', this.entry ? 'return value' : 'return empty', layout.create(entries, { activeId: this.entry?.id, activeStatus: 'READ' }))
  }
}
