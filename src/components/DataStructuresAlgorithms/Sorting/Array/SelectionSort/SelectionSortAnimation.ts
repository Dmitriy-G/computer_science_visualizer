import { ArraySortingAnimation } from '../ArraySortingAnimation.ts'
import { FixedArray } from '../../../../DataStructuresOverview/Linear/Array/FixedArray.ts'

export class SelectionSortAnimation extends ArraySortingAnimation {
  public static describe(size: number) {
    return this.information('Selection Sort', 'Scan the unsorted suffix for its minimum, then swap it into the next sorted position. This swap-based variant is not stable.', size,
      ['O(n²)', 'O(n²)', 'O(n²)'],
      'Every case performs n(n - 1) / 2 comparisons, even for sorted input. At most n - 1 swaps are needed. Average assumes uniformly random permutations of distinct values. Empty and singleton arrays take O(1) time.',
      'O(1)', 'Only scan indices, the minimum index, and one temporary swap entry are needed. The fixed array is not resized.')
  }

  constructor(model: FixedArray) {
    super(model, 'Selection Sort')
    this.result.selectionSort((event) => {
      if (event.kind === 'select') this.record(event, 2, 'Select the minimum candidate', `The smallest value seen so far is ${this.result.getAt(event.index).value} at index ${event.index}.`, `minimum = ${event.index}`)
      else if (event.kind === 'compare') this.record(event, 2, 'Compare with the current minimum', `Compare ${this.result.getAt(event.index).value} at index ${event.index} with the candidate ${this.result.getAt(event.other!).value} at index ${event.other}.`, `if array[${event.index}] < array[${event.other}]: minimum = ${event.index}`)
      else if (event.kind === 'swap') this.record(event, 3, 'Place the minimum', `Swap the minimum into index ${event.index}; the displaced entry moves to index ${event.other}.`, `swap(array[${event.index}], array[${event.other}])`)
      else this.record(event, 4, 'Grow the sorted prefix', `Indices 0 through ${event.index} are now in their final sorted positions.`, `sortedPrefix = ${event.index + 1}`)
    })
    this.finish(false)
  }
}
