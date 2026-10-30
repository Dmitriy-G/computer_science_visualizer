import { DoublyLinkedList } from '../DoublyLinkedList.ts'
import { DoublyLinkedListLayout } from '../DoublyLinkedListLayout.ts'
import { LinkedLayout } from '../../../../../visualization/LinkedLayout.ts'
import { AnimationSequence } from '../../../../../visualization/AnimationSequence.ts'

export class InsertionAnimation extends AnimationSequence {
  public readonly result: DoublyLinkedList

  public static describe(size: number) {
    return AnimationSequence.information(
      'Insert in the middle', 'Insert at floor(length / 2) and connect both pointers.', size,
      ['O(n)', 'O(n)', 'O(n)'],
      'For a growing nonempty list, locating floor(n / 2) from either end takes O(n) in all cases. Connecting next and prev is O(1). Empty and singleton inputs need no traversal.',
      'O(1)', 'One new node and a fixed number of pointers and saved values.',
    )
  }

  constructor(model: DoublyLinkedList, value: number) {
    super()
    this.result = model.clone()
    const entries = model.getEntries()
    const index = Math.floor(model.length / 2)
    const inserted = this.result.insertAt(index, value)
    const pending = { ...inserted, nextId: null, prevId: null }
    const layout = new DoublyLinkedListLayout()
    const frame = { count: model.length }
    const initial = layout.create(entries, { ...frame, activeId: entries[index <= (entries.length - 1) / 2 ? 0 : entries.length - 1]?.id })
    this.add(1, 'Inspect the insertion point', 'Locate the zero-based middle index from the nearer end.', 'index = floor(count / 2)', initial)
    if (entries.length && index > 0 && index < entries.length) {
      const fromHead = index <= (entries.length - 1) / 2
      let position = fromHead ? 0 : entries.length - 1
      const visited: string[] = []
      this.add(2, fromHead ? 'Start at head' : 'Start at tail', 'Locate the successor from the nearer cached end.', fromHead ? 'current = head' : 'current = tail', layout.create(entries, { ...frame, activeId: entries[position].id }))
      while (position !== index) {
        visited.push(entries[position].id)
        position += fromHead ? 1 : -1
        this.add(2, fromHead ? 'Follow next' : 'Follow prev', `Visit index ${position}. Both pointer directions are available.`, fromHead ? 'current = current.next' : 'current = current.prev', layout.create(entries, { ...frame, activeId: entries[position].id, visitedIds: visited }))
      }
    }

    this.add(3, 'Create a pending node', `Allocate a node containing ${value}. Its pointers start empty; the element count is unchanged.`, 'node = Node(value)', layout.create(entries, { ...frame, pending, pendingIndex: index }))
    const predecessor = entries[index - 1]
    const successor = entries[index]
    let edges = [...initial.edges]
    if (predecessor && successor) {
      const oldNext = LinkedLayout.edge(predecessor.id, successor.id, 'next', true)
      edges = edges.filter((edge) => edge.id !== oldNext.id)
      this.add(4, 'Unlink the old next pointer', 'Keep the successor reference before opening a visual gap. Nodes do not occupy consecutive memory.', 'savedNext = successor\npredecessor.next = null', layout.create(entries, { ...frame, pending, pendingIndex: index, edges }))
      const oldPrev = LinkedLayout.edge(successor.id, predecessor.id, 'prev', true)
      edges = edges.filter((edge) => edge.id !== oldPrev.id)
      this.add(4, 'Unlink the old prev pointer', 'Keep the predecessor reference as well. Both directions must be reconnected.', 'savedPrev = predecessor\nsuccessor.prev = null', layout.create(entries, { ...frame, pending, pendingIndex: index, edges }))
    }
    const order: string[] = []
    for (const entry of this.result.getEntries()) order.push(entry.id)
    const placed = { ...frame, pending, pendingIndex: index, order }
    this.add(4, 'Open a visual gap', 'Move the drawing to make room. This movement is only a visual aid for linked nodes.', 'keep saved neighbor references', layout.create(entries, { ...placed, edges }))
    this.add(4, 'Lower the pending node', 'Place the pending node between its saved neighbors.', 'place node between neighbors', layout.create(entries, { ...placed, pendingY: 240, edges }))
    if (successor) {
      edges.push(LinkedLayout.edge(pending.id, successor.id, 'next', true))
      this.add(5, 'Set the new next pointer', 'The new node now points to its successor.', 'node.next = successor', layout.create(entries, { ...placed, pendingY: 240, edges }))
    }
    if (predecessor) {
      edges.push(LinkedLayout.edge(pending.id, predecessor.id, 'prev', true))
      this.add(5, 'Set the new prev pointer', 'The new node can now navigate backward to its predecessor.', 'node.prev = predecessor', layout.create(entries, { ...placed, pendingY: 240, edges }))
    }
    if (predecessor) {
      edges.push(LinkedLayout.edge(predecessor.id, pending.id, 'next', true))
      this.add(5, 'Connect the predecessor', 'Update the previous node to point to the new node.', 'predecessor.next = node', layout.create(entries, { ...placed, pendingY: 240, edges }))
    }
    if (successor) {
      edges.push(LinkedLayout.edge(successor.id, pending.id, 'prev', true))
      this.add(5, 'Connect the successor backward', 'The successor now points backward to the new node. Both directions agree.', 'successor.prev = node', layout.create(entries, { ...placed, pendingY: 240, edges }))
    }
    this.add(5, 'Update the end pointers', 'If the new node is at an end, update the cached end pointer. For an empty input both ends become this node.', 'if predecessor == null: head = node\nif successor == null: tail = node', layout.create(this.result.getEntries(), { ...frame, activeId: pending.id, activeStatus: 'PENDING / CONNECTED', activeTone: 'new' }))
    this.add(6, 'Insertion complete', `Inserted ${value}. The structure now has ${this.result.length} elements.`, 'count += 1', layout.create(this.result.getEntries(), { activeId: pending.id, activeStatus: 'INSERTED' }))
  }
}
