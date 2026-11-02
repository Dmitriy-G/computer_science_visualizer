import { ArraySortingAnimation } from '../ArraySortingAnimation.ts'
import { FixedArray } from '../../../../DataStructuresOverview/Linear/Array/FixedArray.ts'

export class OddEvenSortAnimation extends ArraySortingAnimation {
  public static describe(size: number) {
    return this.information('Odd-Even Sort', 'Alternate even-start and odd-start adjacent comparisons, repeating until both phases finish without swaps.', size,
      ['O(n)', 'O(n²)', 'O(n²)'],
      'An ordered array finishes after one clean two-phase round in O(n). Random distinct permutations give O(n²) average time, and reversed input requires O(n²) worst time. A single clean parity phase cannot end the sort. Empty and singleton inputs take O(1).',
      'O(1)', 'The parity, scan index, swap flag, and temporary exchange reference use constant storage. Only strictly inverted neighbors are exchanged, so equal keys retain their order.')
  }

  constructor(model: FixedArray) {
    super(model, 'Odd-Even Sort')
    this.result.oddEvenSort((event) => this.recordTrace(event))
    this.finish(true)
  }
}
