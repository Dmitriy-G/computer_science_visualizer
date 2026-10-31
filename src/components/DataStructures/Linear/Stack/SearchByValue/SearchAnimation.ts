import { Stack } from '../Stack.ts'
import { StackLayout } from '../StackLayout.ts'
import { AnimationSequence } from '../../../../../visualization/AnimationSequence.ts'

export class SearchAnimation extends AnimationSequence {
  public readonly result: Stack
  public readonly foundId: string | null

  public static describe(size: number) {
    return AnimationSequence.information(
      'Search by value', 'Find the first matching value from the top.', size,
      ['O(1)', 'O(n)', 'O(n)'],
      'Best O(1): the top matches. Worst O(n): the match is at the bottom or absent. Average O(n) assumes uniformly distributed matching depths.',
      'O(1)', 'This search traverses the linked nodes with one pointer; it does not pop or copy values into another stack.',
    )
  }

  constructor(stack: Stack, value: number) {
    super()
    const found = stack.find(value)
    this.foundId = found?.id ?? null
    this.result = stack.clone()
    const entries = stack.getEntries()
    const layout = new StackLayout()
    const visited: string[] = []
    this.add(1, 'Start at the top', 'Search is an optional traversal of this linked stack. It leaves all values in place.', 'current = top', layout.create(entries))
    for (const entry of entries) {
      this.add(2, `Compare ${entry.value} with ${value}`, 'Stop at the first equal value when reading from top to bottom.', `if (current.value === ${value}) return current`, layout.create(entries, { activeId: entry.id, visitedIds: visited }))
      if (entry.id === this.foundId) break
      visited.push(entry.id)
      this.add(2, 'Follow the next pointer', 'Continue toward the bottom without changing the stack.', 'current = current.next', layout.create(entries, { visitedIds: visited }))
    }
    const description = found ? `Found ${value} at depth ${visited.length} from the top (zero-based).` : `Value ${value} was not found.`
    this.add(3, found ? 'Value found' : 'Value not found', description, found ? 'return current' : 'return notFound', layout.create(entries, { activeId: this.foundId, activeStatus: 'FOUND', visitedIds: visited }))
  }
}
