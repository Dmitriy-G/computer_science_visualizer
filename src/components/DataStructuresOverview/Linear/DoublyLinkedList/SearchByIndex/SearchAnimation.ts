import { DoublyLinkedList } from '../DoublyLinkedList.ts'
import { DoublyLinkedListLayout } from '../DoublyLinkedListLayout.ts'
import { AnimationSequence } from '../../../../../visualization/AnimationSequence.ts'

export class SearchAnimation extends AnimationSequence {
  public readonly result: DoublyLinkedList

  public static describe(size: number) {
    return AnimationSequence.information(
      'Search by index', 'Follow next or prev from the nearer end.', size,
      ['O(1)', 'O(n)', 'O(n)'],
      'Best O(1): an end index. Worst O(n): a middle index. Average O(n) assumes uniformly distributed valid indices. Traverse from the nearer end; invalid or empty inputs return immediately.',
      'O(1)', 'A fixed number of pointers and saved values; no replacement list or traversal collection is allocated by the operation.',
    )
  }

  public readonly foundId: string | null

  constructor(model: DoublyLinkedList, index: number) {
    super()
    if (!Number.isSafeInteger(index) || index < 0) throw new RangeError('Index must be a nonnegative safe integer')
    this.result = model.clone()
    const entries = model.getEntries()
    const layout = new DoublyLinkedListLayout()
    const visited: string[] = []
    this.foundId = index < entries.length ? model.getAt(index).id : null
    this.add(1, 'Validate the index', `Requested index ${index}; valid indices are 0 through ${model.length - 1}. An empty list has no valid indices.`, 'if index >= count: return notFound', layout.create(entries))
    if (this.foundId) {
      const fromHead = index <= (model.length - 1) / 2
      let position = fromHead ? 0 : model.length - 1
      this.add(2, fromHead ? 'Read the head pointer' : 'Read the tail pointer', 'Use the nearer end to minimize traversal.', fromHead ? 'current = head' : 'current = tail', layout.create(entries, { activeId: entries[position].id }))
      while (position !== index) {
        visited.push(entries[position].id)
        position += fromHead ? 1 : -1
        this.add(2, `Visit index ${position}`, fromHead ? 'Follow next toward the requested index.' : 'Follow prev toward the requested index.', fromHead ? 'current = current.next' : 'current = current.prev', layout.create(entries, { activeId: entries[position].id, visitedIds: visited }))
      }
    }
    this.add(3, this.foundId ? 'Index found' : 'Index outside the list', this.foundId ? `Found ${entries[index].value} at index ${index}. The list is unchanged.` : 'No node has the requested index. The list is unchanged.', this.foundId ? 'return current' : 'return notFound', layout.create(entries, { activeId: this.foundId, activeStatus: 'FOUND', visitedIds: visited }))
  }
}
