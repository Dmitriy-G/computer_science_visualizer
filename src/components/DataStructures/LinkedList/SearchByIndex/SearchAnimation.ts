import { LinkedList } from '../LinkedList.ts'
import { LinkedListLayout } from '../LinkedListLayout.ts'
import { AnimationSequence } from '../../../../visualization/AnimationSequence.ts'

export class SearchAnimation extends AnimationSequence {
  public readonly result: LinkedList
  public readonly foundId: string | null

  public static describe(size: number) {
    return AnimationSequence.information(
      'Search by index',
      'Follow next pointers to the requested index.',
      size,
      ['O(1)', 'O(n)', 'O(n)'],
      'Best O(1): index 0. Worst O(n): the last index. Average O(n) assumes uniformly distributed valid indices. Stored length rejects invalid indices in O(1).',
      'O(1)',
      'A current-node pointer and index counter in every case.',
    )
  }

  constructor(model: LinkedList, value: number) {
    super()
    this.result = model.clone()
    if (!Number.isSafeInteger(value) || value < 0) throw new RangeError('Index must be a nonnegative safe integer')
    const entries = model.getEntries()
    const found = value < model.length
    const path = []
    if (found) {
      for (let index = 0; index <= value; index += 1) path.push(entries[index])
    }
    const scene = new LinkedListLayout().create(model.getEntries())
    this.add(1, 'Start the search', 'Follow next pointers to the requested zero-based index.', `check 0 <= ${value} < length`, scene)
    const visited: string[] = []
    for (let index = 0; index < path.length; index += 1) {
      const entry = path[index]
      this.add(2, `Visit index ${index}`, `The current node is at index ${index}. Compare that position with the requested index ${value}.`, `if (index === ${value}) return current`, AnimationSequence.mark(scene, entry.id, visited))
      visited.push(entry.id)
      if (index + 1 < path.length) {
        this.add(2, 'Follow the next pointer', 'Follow next and advance the position counter. Linked lists have no direct index access.', 'current = current.next\nindex += 1', AnimationSequence.mark(scene, path[index + 1].id, visited))
      }
    }
    const last = path[path.length - 1]
    const success = found
    this.foundId = success ? last.id : null
    const message = success ? `Index ${value} contains ${last.value}` : `Index ${value} is outside this structure of length ${model.length}`
    const resultScene = AnimationSequence.mark(scene, this.foundId, visited, 'FOUND')
    this.add(3, success ? 'Element found' : 'Index out of range', message, success ? 'return current' : 'return notFound', resultScene)
    this.add(4, 'Search complete', `${message}. The list is unchanged.`, '// no mutation', resultScene)
  }
}
