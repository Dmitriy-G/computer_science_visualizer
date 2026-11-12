import { Deque } from '../Deque.ts'
import type { DequeEntry } from '../Deque.ts'
import { DequeLayout } from '../DequeLayout.ts'
import { LinkedLayout } from '../../../../../visualization/LinkedLayout.ts'
import { AnimationSequence } from '../../../../../visualization/AnimationSequence.ts'

export class RemovalAnimation extends AnimationSequence {
  public readonly result: Deque

  public static describe(size: number) {
    return AnimationSequence.information(
      'Pop front', 'Remove and return the front value.', size,
      ['O(1)', 'O(1)', 'O(1)'],
      'Every case reads or changes a fixed number of cached end pointers and nodes, independent of n. Empty inputs are checked before reading.',
      'O(1)', 'A fixed number of pointers and saved values; no replacement list or traversal collection is allocated by the operation.',
    )
  }

  public readonly removed: DequeEntry | null

  constructor(model: Deque) {
    super()
    this.result = model.clone()
    const entries = model.getEntries()
    const targetIndex = 0
    this.removed = model.isEmpty() ? null : this.result.popFront()
    const layout = new DequeLayout()
    const frame = { count: model.length }
    this.add(1, 'Inspect the structure', 'Check for an empty structure before reading or changing a node.', 'if count == 0: return empty', layout.create(entries, frame))
    this.add(2, 'Read the cached end', 'No traversal is needed for an end removal.', 'current = front', layout.create(entries, { ...frame, activeId: entries[targetIndex]?.id }))
    if (this.removed) {
      const target = entries[targetIndex]
      const predecessor = entries[targetIndex - 1]
      const successor = entries[targetIndex + 1]
      let edges = [...layout.create(entries).edges]
      if (predecessor) {
        edges = edges.filter((edge) => !(edge.from === predecessor.id && edge.label === 'next'))
        if (successor) edges.push(LinkedLayout.edge(predecessor.id, successor.id, 'next', true))
      }
      this.add(3, 'Bypass the node with next', predecessor ? 'The predecessor now skips the removed node, or becomes the last node.' : 'Move the front pointer to the successor, or null for the last removal.', predecessor ? 'predecessor.next = successor' : 'front = successor', layout.create(entries, { ...frame, activeId: target.id, activeStatus: 'REMOVING', edges }))
      if (successor) {
        edges = edges.filter((edge) => !(edge.from === successor.id && edge.label === 'prev'))
        if (predecessor) edges.push(LinkedLayout.edge(successor.id, predecessor.id, 'prev', true))
      }
      this.add(3, 'Reconnect prev', successor ? 'The successor points backward to the predecessor, or null when it becomes the first node.' : 'Move the cached back pointer to the predecessor, or null for the last removal.', successor ? 'successor.prev = predecessor' : 'back = predecessor', layout.create(entries, { ...frame, activeId: target.id, activeStatus: 'REMOVING', edges }))
      const remaining = this.result.getEntries()
      const order: string[] = []
      for (const entry of entries) order.push(entry.id)
      const detached = { ...target, nextId: null, prevId: null }
      this.add(3, 'Detach and release the node', `Save ${target.value} as the return value and release the detached node. Update the cached end pointers.`, 'removed.next = null\nremoved.prev = null\nif successor == null: back = predecessor', layout.create(remaining, { ...frame, order, pending: detached, pendingIndex: targetIndex, pendingY: 100, pendingStatus: 'REMOVING', pendingTone: 'active' }))
      this.add(3, 'Close the visual gap', 'The surviving pointers and end roles now describe the remaining structure. The count is committed on the final frame.', 'release removed', layout.create(remaining, frame))
    }
    this.add(4, this.removed ? 'Removal complete' : 'No value removed', this.removed ? `Returned ${this.removed.value}. There are ${this.result.length} elements remaining.` : 'The structure is empty. There is no value to remove.', this.removed ? 'count -= 1\nreturn removed.value' : 'return empty', layout.create(this.result.getEntries()))
  }
}
