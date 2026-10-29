import { FixedArray } from '../FixedArray.ts'
import { ArrayLayout } from '../ArrayLayout.ts'
import { AnimationSequence } from '../../../../visualization/AnimationSequence.ts'

export class SearchAnimation extends AnimationSequence {
  public readonly result: FixedArray
  public readonly foundId: string | null

  public static describe(size: number) {
    return AnimationSequence.information('Search by value', 'Scan from the beginning and stop at the first equal value.', size, ['O(1)', 'O(n)', 'O(n)'], 'The first node can match immediately. Reaching a later position or exhausting the structure takes linear time.', 'O(1)', 'The iterative algorithm keeps a fixed number of references and counters.')
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
    this.add(1, 'Start the search', 'Scan from the beginning and stop at the first equal value.', 'current = start', scene)
    const visited: string[] = []
    for (let index = 0; index < path.length; index += 1) {
      const entry = path[index]
      this.add(2, `Compare ${value} with ${entry.value}`, 'Compare values in order and stop at the first match.', `if (${value} === ${entry.value}) return current`, AnimationSequence.mark(scene, entry.id, visited))
      visited.push(entry.id)
      if (index + 1 < path.length) {
        this.add(2, 'Follow the search path', 'Move to the next candidate without changing the structure.', `current = ${'next candidate'}`, AnimationSequence.mark(scene, path[index + 1].id, visited))
      }
    }
    const last = path[path.length - 1]
    const success = last !== undefined && last.value === value
    this.foundId = success ? last.id : null
    const message = success ? `Found ${value}${` at index ${path.length - 1}`}` : `Value ${value} was not found`
    const resultScene = AnimationSequence.mark(scene, this.foundId, visited, 'FOUND')
    this.add(3, success ? 'Element found' : 'No matching element', message, success ? 'return current' : 'return notFound', resultScene)
    this.add(4, 'Search complete', 'Search leaves the structure unchanged.', '// no mutation', resultScene)
  }
}
