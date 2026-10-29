import { FixedArray } from '../FixedArray.ts'
import { ArrayLayout } from '../ArrayLayout.ts'
import { SearchAnimation } from '../SearchByValue/SearchAnimation.ts'
import { DeletionLayout } from './DeletionLayout.ts'
import { AnimationSequence } from '../../../../visualization/AnimationSequence.ts'

export class DeletionAnimation extends AnimationSequence {
  public readonly result: FixedArray

  public static describe(size: number) {
    return AnimationSequence.information(
      'Delete by value',
      'Copy into a new fixed array, skipping the first match.',
      size,
      ['O(n)', 'O(n)', 'O(n)'],
      'Every case is O(n): a match requires copying the survivors; a miss scans all elements. An empty input is checked in O(1).',
      ['O(1)', 'O(n)', 'O(n)'],
      'Best O(1): the value is absent. Worst O(n): n - 1 result slots. Average O(n) assumes a constant success probability.',
    )
  }

  constructor(model: FixedArray, value: number) {
    super()
    const search = new SearchAnimation(model, value)
    this.steps.push(...search.steps.slice(0, -1))
    const index = model.findIndex(value)
    this.result = index < 0 ? model.clone() : model.withoutAt(index)
    if (index >= 0) {
      const entries = model.getEntries()
      const layout = new DeletionLayout()
      this.add(4, 'Allocate an exact-sized result', 'Keep the original array unchanged. Allocate a separate array with exactly one fewer slot.', `result = new Array(${model.length - 1})`, layout.create(entries, index, 0))
      let copied = 0
      for (let source = 0; source < entries.length; source += 1) {
        if (source === index) continue
        this.add(5, `Read original index ${source}`, 'Read the next surviving value without changing its original slot.', `read original[${source}]`, layout.create(entries, index, copied, source))
        copied += 1
        this.add(5, `Copy to new index ${copied - 1}`, 'Copy into the next result slot. Every original value and index remains fixed.', `result[${copied - 1}] = original[${source}]`, layout.create(entries, index, copied, source))
      }
      this.add(5, 'Result array is ready', 'Both allocations coexist until the result is committed.', '// all survivors copied', layout.create(entries, index, copied))
    }
    this.add(6, index < 0 ? 'Value not found; array unchanged' : 'Deletion complete', index < 0 ? `Value ${value} was not found. The array still has ${model.length} elements.` : `Removed ${value} at index ${index}. The new array has exactly ${this.result.length} occupied slots; later duplicates remain.`, index < 0 ? 'return original' : 'array = result', new ArrayLayout().create(this.result.getEntries()))
  }
}
