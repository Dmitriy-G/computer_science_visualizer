import { ArraySortingAnimation } from '../ArraySortingAnimation.ts'
import { FixedArray } from '../../../../FundamentalDataStructures/Linear/Array/FixedArray.ts'

export class PancakeSortAnimation extends ArraySortingAnimation {
  public static describe(size: number) {
    return this.information('Pancake Sort', 'Find each remaining maximum and move it into a sorted suffix using at most two prefix flips.', size,
      ['O(n)', 'O(n²)', 'O(n²)'],
      'The ordered-input fast path scans in O(n). Otherwise full maximum scans dominate, giving O(n²) average and worst time; the average upper bound needs no distribution assumption. There are at most 2n - 3 nontrivial prefix flips. Empty and singleton inputs take O(1).',
      'O(1)', 'Maximum selection and pairwise prefix reversal use constant auxiliary storage. No reversed-prefix copy is allocated. Nonadjacent flips can reorder equal keys, so this variant is unstable.')
  }

  constructor(model: FixedArray) {
    super(model, 'Pancake Sort')
    this.result.pancakeSort((event) => this.recordTrace(event))
    this.finish(false)
    this.fitScenes()
  }
}
