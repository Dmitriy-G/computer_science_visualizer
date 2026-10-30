import { CircularBuffer } from '../CircularBuffer.ts'
import { CircularBufferLayout } from '../CircularBufferLayout.ts'
import { AnimationSequence } from '../../../../../visualization/AnimationSequence.ts'

export class SearchAnimation extends AnimationSequence {
  public readonly result: CircularBuffer

  public static describe(size: number) {
    return AnimationSequence.information(
      'Search by value', 'Search occupied slots in logical FIFO order, wrapping as needed.', size,
      ['O(1)', 'O(n)', 'O(n)'],
      'Best O(1): the first value matches. Worst O(n): the last value matches or no value matches. Average O(n) assumes uniformly distributed matching positions. An empty input returns immediately.',
      'O(1)', 'A fixed number of pointers, indices, and saved values. Existing buffer slots require no additional allocation.',
      [
        { symbol: 'capacity', meaning: 'The fixed number of physical slots allocated for this buffer.' },
        { symbol: '%', meaning: 'Remainder: (index + 1) % capacity wraps the last physical index back to zero.' },
      ],
    )
  }

  public readonly foundId: string | null

  constructor(model: CircularBuffer, value: number) {
    super()
    const found = model.find(value)
    this.foundId = found?.id ?? null
    this.result = model.clone()
    const entries = model.getEntries()
    const layout = new CircularBufferLayout()
    const visited: string[] = []
    this.add(1, 'Start at the first value', 'Visit occupied slots in FIFO order, starting at read. Skip unused slots and wrap after the last index.', 'index = read', layout.create(model))
    for (let index = 0; index < entries.length; index += 1) {
      const entry = entries[index]
      this.add(2, `Compare ${entry.value} with ${value}`, 'Stop at the first matching value in traversal order.', 'if current.value == value: return current', layout.create(model, { activeId: entry.id, activeSlot: entry.slot, visitedIds: visited }))
      if (entry.id === this.foundId) break
      visited.push(entry.id)
      const next = entries[index + 1]
      this.add(2, 'Advance with wraparound', 'Move to the next occupied slot in logical FIFO order.', 'index = (index + 1) % capacity', layout.create(model, { activeId: next?.id, activeSlot: next?.slot, visitedIds: visited }))
    }
    this.add(3, found ? 'Value found' : 'Value not found', found ? `Found ${value}. The structure and its order are unchanged.` : `Value ${value} was not found. The structure is unchanged.`, found ? 'return current' : 'return notFound', layout.create(model, { activeId: this.foundId, activeStatus: 'FOUND', visitedIds: visited }))
  }
}
