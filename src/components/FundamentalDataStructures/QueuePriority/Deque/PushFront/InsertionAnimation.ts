import { Deque } from '../Deque.ts'
import { DequeLayout } from '../DequeLayout.ts'
import { LinkedLayout } from '../../../../../visualization/LinkedLayout.ts'
import { AnimationSequence } from '../../../../../visualization/AnimationSequence.ts'

export class InsertionAnimation extends AnimationSequence {
  public readonly result: Deque

  public static describe(size: number) {
    return AnimationSequence.information(
      'Push front', 'Add a value before the front.', size,
      ['O(1)', 'O(1)', 'O(1)'],
      'Every case reads or changes a fixed number of cached end pointers and nodes, independent of n. Empty inputs are checked before reading.',
      'O(1)', 'One new node and a fixed number of pointers and saved values.',
    )
  }

  constructor(model: Deque, value: number) {
    super()
    this.result = model.clone()
    const entries = model.getEntries()
    const index = 0
    const inserted = this.result.pushFront(value)
    const pending = { ...inserted, nextId: null, prevId: null }
    const layout = new DequeLayout()
    const frame = { count: model.length }
    const initial = layout.create(entries, { ...frame, activeId: entries[0]?.id })
    this.add(1, 'Inspect the insertion point', 'Use the cached front pointer.', 'current = front', initial)

    this.add(2, 'Save the end reference', 'The cached end pointer locates the insertion point without traversal.', 'savedEnd = current', initial)
    this.add(3, 'Create a pending node', `Allocate a node containing ${value}. Its pointers start empty; the element count is unchanged.`, 'node = Node(value)', layout.create(entries, { ...frame, pending, pendingIndex: index }))
    const predecessor = entries[index - 1]
    const successor = entries[index]
    const edges = [...initial.edges]
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
    this.add(5, 'Update the end pointers', 'If the new node is at an end, update the cached end pointer. For an empty input both ends become this node.', 'if predecessor == null: front = node\nif successor == null: back = node', layout.create(this.result.getEntries(), { ...frame, activeId: pending.id, activeStatus: 'PENDING / CONNECTED', activeTone: 'new' }))
    this.add(6, 'Insertion complete', `Inserted ${value}. The structure now has ${this.result.length} elements.`, 'count += 1', layout.create(this.result.getEntries(), { activeId: pending.id, activeStatus: 'INSERTED' }))
  }
}
