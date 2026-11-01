import { ArraySortingAnimation } from '../ArraySortingAnimation.ts'
import { FixedArray } from '../FixedArray.ts'

export class InsertionSortAnimation extends ArraySortingAnimation {
  public static describe(size: number) {
    return this.information('Insertion Sort', 'Hold the next value, find its place by scanning backward, shift larger values right, and insert it. Equal values keep their relative order.', size,
      ['O(n)', 'O(n²)', 'O(n²)'],
      'Best: sorted input needs one comparison for each added value and no shifts. Average: uniformly random distinct permutations need quadratic comparisons and shifts. Worst: reverse order shifts every earlier value. Empty and singleton arrays take O(1) time.',
      'O(1)', 'One held entry and a few indices; all movement stays inside the existing fixed allocation.')
  }

  constructor(model: FixedArray) {
    super(model, 'Insertion Sort')
    this.result.insertionSort((event) => {
      if (event.kind === 'hold') this.record(event, 2, 'Hold the next entry', `Hold ${event.frame.held!.value} outside index ${event.index}; the prefix before it is sorted.`, `key = array[${event.index}]`)
      else if (event.kind === 'compare') this.record(event, 2, 'Scan the sorted prefix backward', `Compare held value ${event.frame.held!.value} with ${this.result.getAt(event.index).value} at index ${event.index}. Stop at an equal or smaller value.`, `if array[${event.index}] <= key: stop\nelse: move insertion position left`)
      else if (event.kind === 'shift') this.record(event, 3, 'Shift a larger entry right', `Move index ${event.index} to ${event.other}, leaving the hole one slot farther left.`, `array[${event.other}] = array[${event.index}]`)
      else this.record(event, 4, 'Insert the held entry', `Place the held entry at index ${event.index}; the sorted prefix now contains ${event.other! + 1} entries.`, `array[${event.index}] = key`)
    })
    this.finish(true)
  }
}
