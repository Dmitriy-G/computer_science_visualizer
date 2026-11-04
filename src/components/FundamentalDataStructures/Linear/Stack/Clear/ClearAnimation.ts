import { Stack } from '../Stack.ts'
import { StackLayout } from '../StackLayout.ts'
import { AnimationSequence } from '../../../../../visualization/AnimationSequence.ts'

export class ClearAnimation extends AnimationSequence {
  public readonly result: Stack

  public static describe(size: number) {
    return AnimationSequence.information(
      'Clear', 'Pop every element, from top to bottom.', size,
      ['O(n)', 'O(n)', 'O(n)'],
      'Every case removes all n nodes: O(n). This action releases them one at a time. An empty stack needs only a constant-time check.',
      'O(1)', 'Reuse a few pointers; no second stack or recursion is needed.',
    )
  }

  constructor(stack: Stack) {
    super()
    this.result = stack.clone()
    this.result.clear()
    const entries = stack.getEntries()
    const layout = new StackLayout()
    const frame = { maxDepth: stack.length, count: stack.length }
    this.add(1, 'Start at the top', entries.length ? 'Remove values in last-in, first-out order until the stack is empty.' : 'The stack is already empty.', 'while top != null:', layout.create(entries, frame))
    for (let index = 0; index < entries.length; index += 1) {
      const remaining = entries.slice(index)
      const current = layout.create(remaining, { ...frame, activeId: entries[index].id, activeStatus: 'REMOVE' })
      this.add(2, `Remove top value ${entries[index].value}`, 'Save the next top pointer before releasing this node.', 'removed = top\ntop = top.next', current)
      this.add(2, 'Release the removed node', 'Lift the detached node out. The remaining values stay in their original order.', 'release(removed)', layout.create(entries.slice(index + 1), { ...frame, pending: entries[index], pendingY: current.nodes[0].y - 72, pendingStatus: 'REMOVING', pendingTone: 'active' }))
    }
    this.add(3, 'Clear complete', `Removed ${stack.length} elements. The top pointer is null and the count is 0.`, 'top = null\ncount = 0', layout.create([], { maxDepth: stack.length }))
  }
}
