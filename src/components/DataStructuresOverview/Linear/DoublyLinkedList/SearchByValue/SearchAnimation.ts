import { DoublyLinkedList } from '../DoublyLinkedList.ts'
import { DoublyLinkedListLayout } from '../DoublyLinkedListLayout.ts'
import { AnimationSequence } from '../../../../../visualization/AnimationSequence.ts'

export class SearchAnimation extends AnimationSequence {
  public readonly result: DoublyLinkedList

  public static describe(size: number) {
    return AnimationSequence.information(
      'Search by value', 'Follow next pointers to the first match.', size,
      ['O(1)', 'O(n)', 'O(n)'],
      'Best O(1): the first value matches. Worst O(n): the last value matches or no value matches. Average O(n) assumes uniformly distributed matching positions. An empty input returns immediately.',
      'O(1)', 'A fixed number of pointers and saved values; no replacement list or traversal collection is allocated by the operation.',
    )
  }

  public readonly foundId: string | null

  constructor(model: DoublyLinkedList, value: number) {
    super()
    const found = model.find(value)
    this.foundId = found?.id ?? null
    this.result = model.clone()
    const entries = model.getEntries()
    const layout = new DoublyLinkedListLayout()
    const visited: string[] = []
    this.add(1, 'Start at the first value', 'Follow next pointers from head; search never removes or reorders values.', 'current = head', layout.create(entries))
    for (let index = 0; index < entries.length; index += 1) {
      const entry = entries[index]
      this.add(2, `Compare ${entry.value} with ${value}`, 'Stop at the first matching value in traversal order.', 'if current.value == value: return current', layout.create(entries, { activeId: entry.id, visitedIds: visited }))
      if (entry.id === this.foundId) break
      visited.push(entry.id)
      const next = entries[index + 1]
      this.add(2, 'Follow next', 'Move to the next node without changing any pointer.', 'current = current.next', layout.create(entries, { activeId: next?.id, visitedIds: visited }))
    }
    this.add(3, found ? 'Value found' : 'Value not found', found ? `Found ${value} at index ${visited.length} (zero-based).` : `Value ${value} was not found.`, found ? 'return current' : 'return notFound', layout.create(entries, { activeId: this.foundId, activeStatus: 'FOUND', visitedIds: visited }))
  }
}
