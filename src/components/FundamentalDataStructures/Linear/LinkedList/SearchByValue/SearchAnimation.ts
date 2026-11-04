import { LinkedList } from '../LinkedList.ts'
import { LinkedListLayout } from '../LinkedListLayout.ts'
import { AnimationSequence } from '../../../../../visualization/AnimationSequence.ts'

export class SearchAnimation extends AnimationSequence {
  public readonly result: LinkedList
  public readonly foundId: string | null

  public static describe(size: number) {
    return AnimationSequence.information(
      'Search by value',
      'Follow next pointers until the first match.',
      size,
      ['O(1)', 'O(n)', 'O(n)'],
      'Best O(1): the head matches. Worst O(n): the match is last or absent. Average O(n) assumes uniformly distributed matching positions.',
      'O(1)',
      'A current-node pointer and counter in every case.',
    )
  }

  constructor(model: LinkedList, value: number) {
    super()
    this.result = model.clone()
    if (!Number.isSafeInteger(value)) throw new TypeError('Values must be safe integers')
    const path = []
    for (const entry of model.getEntries()) {
      path.push(entry)
      if (entry.value === value) break
    }
    const scene = new LinkedListLayout().create(model.getEntries())
    this.add(1, 'Start the search', 'Start at the head and stop at the first equal value.', 'current = head', scene)
    const visited: string[] = []
    for (let index = 0; index < path.length; index += 1) {
      const entry = path[index]
      this.add(2, `Compare ${value} with ${entry.value}`, 'Compare values in order and stop at the first match.', `if (${value} === ${entry.value}) return current`, AnimationSequence.mark(scene, entry.id, visited))
      visited.push(entry.id)
      if (index + 1 < path.length) {
        this.add(2, 'Follow the next pointer', 'The current value differs. Follow its next pointer without changing the list.', 'current = current.next', AnimationSequence.mark(scene, path[index + 1].id, visited))
      }
    }
    const last = path[path.length - 1]
    const success = last !== undefined && last.value === value
    this.foundId = success ? last.id : null
    const message = success ? `Found ${value} at index ${path.length - 1}` : `Value ${value} was not found`
    const resultScene = AnimationSequence.mark(scene, this.foundId, visited, 'FOUND')
    this.add(3, success ? 'Element found' : 'No matching element', message, success ? 'return current' : 'return notFound', resultScene)
  }
}
