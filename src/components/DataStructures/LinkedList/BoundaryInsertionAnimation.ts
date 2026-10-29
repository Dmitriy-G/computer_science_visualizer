import { LinkedList } from './LinkedList.ts'
import { LinkedListLayout } from './LinkedListLayout.ts'
import { AnimationSequence } from '../../../visualization/AnimationSequence.ts'

export class BoundaryInsertionAnimation extends AnimationSequence {
  public readonly result: LinkedList
  public readonly insertionIndex: number

  constructor(list: LinkedList, value: number, end: boolean) {
    super()
    this.insertionIndex = end ? list.length : 0
    this.result = list.clone()
    const pendingNode = this.result.insertAt(this.insertionIndex, value)
    const entries = list.getEntries()
    const layout = new LinkedListLayout()
    this.add(1, 'Start at the head', 'Read the head pointer. An empty list has a null head.', 'current = head', layout.create(entries, { activeIndex: 0 }))
    if (end) {
      for (let index = 0; index < entries.length; index += 1) {
        this.add(2, `Visit index ${index}`, 'Follow next pointers until the last node. This list has no cached tail pointer.', 'if current.next != null: current = current.next', layout.create(entries, { activeIndex: index, visitedThrough: index - 1 }))
      }
    }
    const base = { pendingNode, insertionIndex: this.insertionIndex, showPending: true }
    this.add(3, 'Create a pending node', `Allocate ${value}. The committed list still has ${list.length} nodes.`, `newNode = Node(${value})`, layout.create(entries, base))
    const placed = { ...base, gap: true, lowered: true }
    this.add(4, 'Position the new node', 'Open a gap in the drawing. Existing nodes do not move in memory.', '// visual positioning only', layout.create(entries, placed))
    this.add(5, end ? 'Set the new next pointer to null' : 'Connect the new node to the old head', end ? 'The new node will be the last node.' : 'Save the old head as the successor before replacing head.', end ? 'newNode.next = null' : 'newNode.next = head', layout.create(entries, { ...placed, connectNext: !end }))
    this.add(5, end && entries.length ? 'Connect the last node' : 'Update the head pointer', 'Connect the pending node to the list.', end && entries.length ? 'current.next = newNode' : 'head = newNode', layout.create(entries, { ...placed, connectNext: !end, connectPrevious: end }))
    this.add(6, 'Insertion complete', `The list now has ${this.result.length} nodes.`, 'size += 1', AnimationSequence.mark(layout.create(this.result.getEntries()), pendingNode.id, [], 'INSERTED'))
  }
}
