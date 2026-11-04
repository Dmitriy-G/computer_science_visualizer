import { ArraySortingAnimation } from '../ArraySortingAnimation.ts'
import { FixedArray } from '../../../../FundamentalDataStructures/Linear/Array/FixedArray.ts'

export class QuickSortAnimation extends ArraySortingAnimation {
  public static describe(size: number) {
    return this.information('Quick Sort', 'Use the last entry as a Lomuto pivot, partition values into <= pivot and > pivot, then recursively sort both sides. This swap-based variant is not stable.', size,
      ['O(n log n)', 'O(n log n)', 'O(n²)'],
      'Best: pivots split ranges roughly evenly. Average: uniformly random permutations of distinct values give balanced splits in expectation. Worst: sorted, reverse-sorted, or all-equal input repeatedly leaves one empty side with this last-entry pivot. Empty and singleton arrays take O(1) time.',
      ['O(log n)', 'O(log n)', 'O(n)'], 'In-place partitioning needs constant temporary storage; recursive calls need logarithmic stack space for balanced or expected random splits and linear stack space for a chain. Animation tracking is excluded.')
  }

  constructor(model: FixedArray) {
    super(model, 'Quick Sort')
    const sorted = new Set<number>()
    this.result.quickSort((event) => {
      if (event.kind === 'partition') sorted.add(event.index)
      const marked = { ...event, frame: { ...event.frame, sortedIndices: [...sorted] } }
      if (event.kind === 'pivot') this.record(marked, 2, 'Choose the last entry as pivot', `Partition indices ${event.left}–${event.right} around pivot ${this.result.getAt(event.index).value} at index ${event.index}.`, `pivot = array[${event.index}]\nboundary = ${event.left}`)
      else if (event.kind === 'compare') this.record(marked, 2, 'Compare with the pivot', `Compare ${this.result.getAt(event.index).value} at index ${event.index} with pivot ${this.result.getAt(event.other!).value}. Values <= pivot go to the left partition.`, `if array[${event.index}] <= pivot:\n  swap into left partition; boundary += 1`)
      else if (event.kind === 'swap') this.record(marked, 3, 'Swap partition entries', `Swap indices ${event.index} and ${event.other} to establish the partition around the pivot.`, `swap(array[${event.index}], array[${event.other}])`)
      else this.record(marked, 4, 'Fix a sorted position', `Index ${event.index} is final. ${event.left === event.right ? 'This range contains one entry.' : 'Sort the two remaining ranges independently.'}`, `pivotIndex = ${event.index}\nsort(${event.left}, ${event.index - 1}); sort(${event.index + 1}, ${event.right})`)
    })
    this.finish(false)
  }
}
