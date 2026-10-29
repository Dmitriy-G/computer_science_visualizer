import { FixedArray } from '../FixedArray.ts'
import { ArrayLayout } from '../ArrayLayout.ts'
import { AnimationSequence } from '../../../../visualization/AnimationSequence.ts'

export class SearchAnimation extends AnimationSequence {
  public readonly result: FixedArray
  public readonly foundId: string | null

  public static describe(size: number) {
    return AnimationSequence.information('Search by index', 'Read an indexed slot directly.', size, ['O(1)', 'O(1)', 'O(1)'], 'Bounds checking and direct slot access take constant time.', 'O(1)', 'The iterative algorithm keeps a fixed number of references and counters.')
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
    for (let index = 0; index < path.length; index += 1) {
      const entry = path[index]
      this.add(2, `Read index ${value}`, 'Read the indexed slot directly after checking the bounds.', `return array[${value}]`, AnimationSequence.mark(scene, entry.id, visited))
      visited.push(entry.id)
      if (index + 1 < path.length) {
        this.add(2, 'Follow the search path', 'Move to the next candidate without changing the structure.', `current = ${'next candidate'}`, AnimationSequence.mark(scene, path[index + 1].id, visited))
      }
    }
    const last = path[path.length - 1]
    const success = found
    this.foundId = success ? last.id : null
    const message = success ? `Index ${value} contains ${last.value}` : `Index ${value} is outside this structure of length ${model.length}`
    const resultScene = AnimationSequence.mark(scene, this.foundId, visited, 'FOUND')
    this.add(3, success ? 'Element found' : 'No matching element', message, success ? 'return current' : 'return notFound', resultScene)
    this.add(4, 'Search complete', 'Search leaves the structure unchanged.', '// no mutation', resultScene)
  }
}
