import { ArraySortingAnimation } from '../ArraySortingAnimation.ts'
import { FixedArray } from '../FixedArray.ts'

export class BinaryInsertionSortAnimation extends ArraySortingAnimation {
  public static describe(size: number) {
    return this.information('Binary Insertion Sort', 'Use binary search for the position after existing equal values, then shift the suffix of the sorted prefix right and insert the held entry.', size,
      ['O(n log n)', 'O(n²)', 'O(n²)'],
      'This implementation always binary-searches the prefix: best-case sorted input needs O(n log n) comparisons but no shifts. Average assumes uniformly random distinct permutations; average and worst movement are quadratic. Reverse order maximizes shifts. Empty and singleton inputs take O(1) time.',
      'O(1)', 'Binary-search bounds, shift indices, and one held entry. Binary search reduces comparisons, not the number of moved entries.')
  }

  constructor(model: FixedArray) {
    super(model, 'Binary Insertion Sort')
    this.result.binaryInsertionSort((event) => {
      if (event.kind === 'hold') this.record(event, 2, 'Hold the next entry', `Hold ${event.frame.held!.value} and search the sorted prefix before index ${event.index}.`, `key = array[${event.index}]\nlow = 0; high = ${event.index}`)
      else if (event.kind === 'compare') this.record(event, 2, 'Probe the midpoint', `Search [${event.left}, ${event.right}): compare held ${event.frame.held!.value} with ${this.result.getAt(event.index).value} at midpoint ${event.index}. Equal values send the search right to preserve stability.`, `mid = ${event.index}\nif key < array[mid]: high = mid\nelse: low = mid + 1`)
      else if (event.kind === 'bounds') this.record(event, 2, 'Locate the insertion position', `The binary-search bounds meet at index ${event.index}. Insert after any earlier equal values.`, `insertionPosition = ${event.index}`)
      else if (event.kind === 'shift') this.record(event, 3, 'Shift an entry right', `Move index ${event.index} into index ${event.other}; binary search does not remove this movement cost.`, `array[${event.other}] = array[${event.index}]`)
      else this.record(event, 4, 'Insert the held entry', `Insert at index ${event.index}; the first ${event.other! + 1} entries are now sorted.`, `array[${event.index}] = key`)
    })
    this.finish(true)
  }
}
