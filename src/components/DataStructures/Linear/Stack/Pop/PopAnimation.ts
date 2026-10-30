import { Stack } from '../Stack.ts'
import type { StackEntry } from '../Stack.ts'
import { StackLayout } from '../StackLayout.ts'
import { AnimationSequence } from '../../../../../visualization/AnimationSequence.ts'

export class PopAnimation extends AnimationSequence {
  public readonly result: Stack
  public readonly removed: StackEntry | null

  public static describe(size: number) {
    return AnimationSequence.information(
      'Pop', 'Remove and return the top value.', size,
      ['O(1)', 'O(1)', 'O(1)'],
      'Every case is O(1), independent of n: remove the top and update one pointer. An empty stack returns no value.',
      'O(1)', 'A removed value and a few pointers in every case.',
    )
  }

  constructor(stack: Stack) {
    super()
    this.result = stack.clone()
    this.removed = this.result.pop()
    const entries = stack.getEntries()
    const layout = new StackLayout()
    const frame = { maxDepth: stack.length, count: stack.length }
    const initial = layout.create(entries, { ...frame, activeId: entries[0]?.id, activeStatus: 'TOP' })
    this.add(1, 'Inspect the top', 'Only the top element can be popped. Check for an empty stack first.', 'if top == null: return empty', initial)
    if (this.removed) {
      const remaining = this.result.getEntries()
      this.add(2, 'Lift the top value', `Save ${this.removed.value} as the return value and lift it out of the stack.`, 'removed = top', layout.create(remaining, { ...frame, pending: this.removed, pendingY: initial.nodes[0].y - 72, pendingStatus: 'REMOVING', pendingTone: 'active' }))
      this.add(3, 'Update the top pointer', remaining.length ? `${remaining[0].value} becomes the new top.` : 'The last element was removed. The top pointer becomes null.', 'top = removed.next', layout.create(remaining, { ...frame, activeId: remaining[0]?.id, activeStatus: 'TOP' }))
    } else {
      this.add(2, 'Stack is empty', 'There is no top value to remove. Leave the stack unchanged.', 'return empty', initial)
    }
    this.add(4, this.removed ? 'Pop complete' : 'Nothing to pop', this.removed ? `Returned ${this.removed.value}. The stack now has ${this.result.length} elements.` : 'The stack remains empty. Push a value before popping.', this.removed ? 'count -= 1\nreturn removed.value' : 'return empty', layout.create(this.result.getEntries(), { maxDepth: stack.length }))
  }
}
