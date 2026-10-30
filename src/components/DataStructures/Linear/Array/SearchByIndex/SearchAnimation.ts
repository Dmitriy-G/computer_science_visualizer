import { FixedArray } from '../FixedArray.ts'
import { ArrayLayout } from '../ArrayLayout.ts'
import { AnimationSequence } from '../../../../../visualization/AnimationSequence.ts'

export class SearchAnimation extends AnimationSequence {
  public readonly result: FixedArray
  public readonly foundId: string | null

  public static describe(size: number) {
    return AnimationSequence.information(
      'Search by index',
      'Read the requested slot directly.',
      size,
      ['O(1)', 'O(1)', 'O(1)'],
      'Every case is O(1): check the bounds and read one slot. Invalid indices are also rejected in O(1).',
      'O(1)',
      'An index and returned value in every case.',
    )
  }

  constructor(model: FixedArray, value: number) {
    super()
    this.result = model.clone()
    if (!Number.isSafeInteger(value) || value < 0) throw new RangeError('Index must be a nonnegative safe integer')
    const entries = model.getEntries()
    const found = value < model.length
    const path = []
    if (found) path.push(entries[value])
    const scene = new ArrayLayout().create(model.getEntries())
    this.add(1, 'Start the search', 'Read an indexed slot directly.', `check 0 <= ${value} < length`, scene)
    const visited: string[] = []
    if (found) {
      const entry = entries[value]
      this.add(2, `Read index ${value}`, 'Read the indexed slot directly after checking the bounds.', `return array[${value}]`, AnimationSequence.mark(scene, entry.id))
      visited.push(entry.id)
    }
    const last = path[path.length - 1]
    const success = found
    this.foundId = success ? last.id : null
    const message = success ? `Index ${value} contains ${last.value}` : `Index ${value} is outside this structure of length ${model.length}`
    const resultScene = AnimationSequence.mark(scene, this.foundId, visited, 'FOUND')
    this.add(3, success ? 'Element found' : 'Index out of range', message, success ? `return array[${value}]` : 'return notFound', resultScene)
    this.add(4, 'Search complete', `${message}. The array is unchanged.`, '// no mutation', resultScene)
  }
}
