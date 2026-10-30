import { Stack } from '../Stack.ts'
import { StackLayout } from '../StackLayout.ts'
import { AnimationSequence } from '../../../../../visualization/AnimationSequence.ts'

export class PushAnimation extends AnimationSequence {
  public readonly result: Stack

  public static describe(size: number) {
    return AnimationSequence.information(
      'Push', 'Place a new value on top of the stack.', size,
      ['O(1)', 'O(1)', 'O(1)'],
      'Every case is O(1), independent of n: connect one new top node. This linked stack never resizes an array.',
      'O(1)', 'One new node and a few pointers in every case.',
    )
  }

  constructor(stack: Stack, value: number) {
    super()
    this.result = stack.clone()
    const pending = this.result.push(value)
    const entries = stack.getEntries()
    const layout = new StackLayout()
    const frame = { maxDepth: stack.length + 1, count: stack.length }
    const destination = layout.create(this.result.getEntries(), frame).nodes[0].y
    this.add(1, 'Read the top pointer', 'Push adds at the top. The existing stack order stays unchanged.', 'oldTop = top', layout.create(entries, { ...frame, activeId: entries[0]?.id }))
    this.add(2, 'Create a pending top', `Allocate a node containing ${value}. It is not committed yet.`, `newNode = Node(${value})`, layout.create(entries, { ...frame, pending, pendingY: destination - 80 }))
    this.add(3, 'Place the new node on top', 'Connect the new node to the old top, then update the top pointer.', 'newNode.next = oldTop\ntop = newNode', layout.create(entries, { ...frame, pending, pendingY: destination }))
    this.add(4, 'Push complete', `${value} is now the top. The stack has ${this.result.length} elements. Last in, first out: this value will be popped next.`, 'count += 1', layout.create(this.result.getEntries(), { maxDepth: frame.maxDepth, activeId: pending.id, activeStatus: 'PUSHED' }))
  }
}
