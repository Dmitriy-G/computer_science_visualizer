import { FixedArray } from '../FixedArray.ts'
import { ArrayLayout } from '../ArrayLayout.ts'
import { AnimationSequence } from '../../../../../visualization/AnimationSequence.ts'

export class SearchAnimation extends AnimationSequence {
  public readonly result: FixedArray
  public readonly foundId: string | null

  public static describe(size: number) {
    return AnimationSequence.information(
      'Search by value',
      'Scan from index 0 to the first match.',
      size,
      ['O(1)', 'O(n)', 'O(n)'],
      'Best O(1): index 0 matches. Worst O(n): the match is last or absent. Average O(n) assumes uniformly distributed matching indices.',
      'O(1)',
      'A target value and index in every case.',
    )
  }

  constructor(model: FixedArray, value: number) {
    super()
    this.result = model.clone()
    if (!Number.isSafeInteger(value)) throw new TypeError('Values must be safe integers')
    const path = []
    for (const entry of model.getEntries()) {
      path.push(entry)
      if (entry.value === value) break
    }
    const scene = new ArrayLayout().create(model.getEntries())
    this.add(1, 'Start the search', 'Start at index 0 and stop at the first equal value.', 'index = 0', scene)
    const visited: string[] = []
    for (let index = 0; index < path.length; index += 1) {
      const entry = path[index]
      this.add(2, `Compare ${value} with ${entry.value}`, `Compare the value at index ${index} with the requested value. Stop if they are equal.`, `if (array[${index}] === ${value}) return ${index}`, AnimationSequence.mark(scene, entry.id, visited))
      visited.push(entry.id)
      if (index + 1 < path.length) {
        this.add(2, 'Read the next slot', 'Advance to the next index without changing the array.', 'index += 1', AnimationSequence.mark(scene, path[index + 1].id, visited))
      }
    }
    const last = path[path.length - 1]
    const success = last !== undefined && last.value === value
    this.foundId = success ? last.id : null
    const message = success ? `Found ${value} at index ${path.length - 1}` : `Value ${value} was not found`
    const resultScene = AnimationSequence.mark(scene, this.foundId, visited, 'FOUND')
    this.add(3, success ? 'Element found' : 'No matching element', message, success ? `return ${path.length - 1}` : 'return notFound', resultScene)
    this.add(4, 'Search complete', `${message}. The array is unchanged.`, '// no mutation', resultScene)
  }
}
