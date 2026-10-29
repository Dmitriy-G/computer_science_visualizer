import { Stack } from '../Stack.ts'
import type { StackEntry } from '../Stack.ts'
import { StackLayout } from '../StackLayout.ts'
import { AnimationSequence } from '../../../../visualization/AnimationSequence.ts'

export class PeekAnimation extends AnimationSequence {
  public readonly result: Stack
  public readonly entry: StackEntry | null

  public static describe(size: number) {
    return AnimationSequence.information(
      'Peek', 'Read the top value without removing it.', size,
      ['O(1)', 'O(1)', 'O(1)'],
      'Every case is O(1), independent of n: read the top pointer. An empty stack returns no value.',
      'O(1)', 'Only the returned value is needed.',
    )
  }

  constructor(stack: Stack) {
    super()
    this.result = stack.clone()
    this.entry = stack.peek()
    const layout = new StackLayout()
    const entries = stack.getEntries()
    this.add(1, 'Inspect the top pointer', 'Check whether a top element exists.', 'if top == null: return empty', layout.create(entries))
    const scene = layout.create(entries, { activeId: this.entry?.id, activeStatus: 'PEEK' })
    const message = this.entry ? `The top value is ${this.entry.value}.` : 'The stack is empty; there is no top value.'
    this.add(2, this.entry ? 'Read the top value' : 'Stack is empty', message, this.entry ? 'value = top.value' : 'return empty', scene)
    this.add(3, 'Peek complete', `${message} The stack and its order are unchanged.`, this.entry ? 'return value  // no pop' : 'return empty', scene)
  }
}
