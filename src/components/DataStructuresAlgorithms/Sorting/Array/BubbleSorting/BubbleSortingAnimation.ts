import { AnimationSequence } from '../../../../../visualization/AnimationSequence.ts'
import { FixedArray } from '../../../../DataStructuresOverview/Linear/Array/FixedArray.ts'
import { BubbleSortingLayout } from './BubbleSortingLayout.ts'

export class BubbleSortingAnimation extends AnimationSequence {
  public readonly result: FixedArray

  public static describe(size: number) {
    return AnimationSequence.information(
      'Bubble Sort',
      'Compare neighboring values, swap only when the left value is larger, and stop after a pass without swaps. Equal values retain their relative order.',
      size,
      ['O(n)', 'O(n²)', 'O(n²)'],
      'Best: an already sorted array needs one pass of n - 1 comparisons. Average: uniformly random permutations of distinct values require quadratic work. Worst: reverse order requires n(n - 1) / 2 comparisons and swaps. Empty and singleton arrays finish in O(1) time.',
      'O(1)',
      'Sort within the fixed allocation using one temporary entry, loop indices, and a swap flag. No output allocation is required by bubble sort. The playback clone and scene snapshots are visualization overhead.',
    )
  }

  constructor(model: FixedArray) {
    super()
    this.result = model.clone()
    const layout = new BubbleSortingLayout()
    this.add(1, 'Inspect the array', `Sort ${model.length} values in ascending order. Each pass moves its largest remaining value to the right.`, 'end = array.length - 1', layout.create(model.getEntries()))
    this.result.bubbleSort((event) => {
      const entries = this.result.getEntries()
      if (event.kind === 'compare') {
        const left = entries[event.index].value
        const right = entries[event.index + 1].value
        this.add(2, 'Compare adjacent values', `Compare ${left} at index ${event.index} with ${right} at index ${event.index + 1}. ${left > right ? 'The left value is larger: swap this pair.' : 'Keep this pair in its current order.'}`, `if array[${event.index}] > array[${event.index + 1}]`, layout.create(entries, event.end + 1, event.index))
      } else if (event.kind === 'swap') {
        this.add(3, 'Swap adjacent values', `Swap indices ${event.index} and ${event.index + 1}: ${entries[event.index].value} now comes before ${entries[event.index + 1].value}. The array keeps exactly ${model.length} slots.`, `swap(array[${event.index}], array[${event.index + 1}])\nswapped = true`, layout.create(entries, event.end + 1, event.index, true))
      } else {
        this.add(4, 'Finish the pass', event.swapped ? `Index ${event.end} is now in its final sorted position. Continue with the shorter unsorted prefix.` : 'This pass made no swaps, so the entire array is sorted. Stop early.', event.swapped ? `end = ${event.end - 1}` : 'if not swapped: break', layout.create(entries, event.swapped ? event.end : 0))
      }
    })
    this.add(5, 'Sorting complete', model.length < 2 ? 'An empty or singleton array is already sorted; no comparisons or swaps are needed.' : 'The array is sorted in ascending order. Equal values preserve their original order.', 'commit array', layout.create(this.result.getEntries(), 0))
  }
}
