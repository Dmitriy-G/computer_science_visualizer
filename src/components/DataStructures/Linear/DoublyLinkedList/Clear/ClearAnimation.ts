import { DoublyLinkedList } from '../DoublyLinkedList.ts'
import { DoublyLinkedListLayout } from '../DoublyLinkedListLayout.ts'
import { AnimationSequence } from '../../../../../visualization/AnimationSequence.ts'

export class ClearAnimation extends AnimationSequence {
  public readonly result: DoublyLinkedList

  public static describe(size: number) {
    return AnimationSequence.information(
      'Clear', 'Release nodes one at a time and empty both end pointers.', size,
      ['O(n)', 'O(n)', 'O(n)'],
      'For the same nonempty input size, every case explicitly releases all n values in logical order. Empty inputs return immediately.',
      'O(1)', 'A fixed number of pointers and saved values; no replacement list or traversal collection is allocated by the operation.',
    )
  }

  constructor(model: DoublyLinkedList) {
    super()
    this.result = model.clone()
    const layout = new DoublyLinkedListLayout()
    const frame = { count: model.length }
    this.add(1, 'Inspect the structure', 'Clear releases one node or occupied slot at a time. Empty inputs require no removals.', 'while count > 0:', layout.create(model.getEntries(), frame))
    while (!this.result.isEmpty()) {
      const current = this.result.peekFront()
      this.add(2, `Release value ${current!.value}`, 'Save the successor before releasing this value. Continue in logical order.', 'savedNext = head.next\nrelease head', layout.create(this.result.getEntries(), { ...frame, activeId: current?.id, activeStatus: 'RELEASING' }))
      this.result.removeAt(0)
      this.add(2, 'Advance to the next value', 'The removed value has been released; the scene count stays uncommitted until the end.', 'head = savedNext\nif head != null: head.prev = null', layout.create(this.result.getEntries(), frame))
    }
    this.add(3, 'Clear complete', 'All values have been released. The structure is empty and can be used again.', 'head = tail = null\ncount = 0', layout.create(this.result.getEntries()))
  }
}
