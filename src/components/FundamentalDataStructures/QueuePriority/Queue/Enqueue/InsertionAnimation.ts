import { Queue } from '../Queue.ts'
import { QueueLayout } from '../QueueLayout.ts'
import { LinkedLayout } from '../../../../../visualization/LinkedLayout.ts'
import { AnimationSequence } from '../../../../../visualization/AnimationSequence.ts'

export class InsertionAnimation extends AnimationSequence {
  public readonly result: Queue

  public static describe(size: number) {
    return AnimationSequence.information(
      'Enqueue', 'Add a value at the rear.', size,
      ['O(1)', 'O(1)', 'O(1)'],
      'Every case reads or changes a fixed number of cached end pointers and nodes, independent of n. Empty inputs are checked before reading.',
      'O(1)', 'One new node and a fixed number of pointers and saved values.',
    )
  }

  constructor(model: Queue, value: number) {
    super()
    this.result = model.clone()
    const entries = model.getEntries()
    const index = model.length
    const inserted = this.result.enqueue(value)
    const pending = { ...inserted, nextId: null }
    const layout = new QueueLayout()
    const frame = { count: model.length }
    const initial = layout.create(entries, { ...frame, activeId: entries[entries.length - 1]?.id })
    this.add(1, 'Inspect the insertion point', 'Use the cached rear pointer.', 'current = rear', initial)

    this.add(2, 'Save the end reference', 'The cached end pointer locates the insertion point without traversal.', 'savedEnd = current', initial)
    this.add(3, 'Create a pending node', `Allocate a node containing ${value}. Its pointers start empty; the element count is unchanged.`, 'node = Node(value)', layout.create(entries, { ...frame, pending, pendingIndex: index }))
    const predecessor = entries[index - 1]
    const successor = entries[index]
    const edges = [...initial.edges]
    const order: string[] = []
    for (const entry of this.result.getEntries()) order.push(entry.id)
    const placed = { ...frame, pending, pendingIndex: index, order }
    this.add(4, 'Lower the pending node', 'Place the pending node after the last existing node; existing nodes stay in place.', 'place node between neighbors', layout.create(entries, { ...placed, pendingY: 240, edges }))
    if (successor) {
      edges.push(LinkedLayout.edge(pending.id, successor.id, 'next', false))
      this.add(5, 'Set the new next pointer', 'The new node now points to its successor.', 'node.next = successor', layout.create(entries, { ...placed, pendingY: 240, edges }))
    }

    if (predecessor) {
      edges.push(LinkedLayout.edge(predecessor.id, pending.id, 'next', false))
      this.add(5, 'Connect the predecessor', 'Update the previous node to point to the new node.', 'predecessor.next = node', layout.create(entries, { ...placed, pendingY: 240, edges }))
    }

    this.add(5, 'Update the end pointers', 'If the new node is at an end, update the cached end pointer. For an empty input both ends become this node.', 'if predecessor == null: front = node\nif successor == null: rear = node', layout.create(this.result.getEntries(), { ...frame, activeId: pending.id, activeStatus: 'PENDING / CONNECTED', activeTone: 'new' }))
    this.add(6, 'Insertion complete', `Inserted ${value}. The structure now has ${this.result.length} elements.`, 'count += 1', layout.create(this.result.getEntries(), { activeId: pending.id, activeStatus: 'INSERTED' }))
  }
}
