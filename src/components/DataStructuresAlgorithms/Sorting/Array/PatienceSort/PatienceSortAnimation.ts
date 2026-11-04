import { ArraySortingAnimation } from '../ArraySortingAnimation.ts'
import { FixedArray } from '../../../../FundamentalDataStructures/Linear/Array/FixedArray.ts'

export class PatienceSortAnimation extends ArraySortingAnimation {
  public static describe(size: number) {
    return this.information('Patience Sort', 'Binary-search pile tops to deal entries into decreasing piles, then merge their tops through a min-heap.', size,
      ['O(n)', 'O(n log n)', 'O(n log n)'],
      'Nonincreasing or all-equal input forms one pile and takes O(n). Average assumes random distinct permutations. Binary-search placement and heap merging take O(n log n) in the worst case, including increasing input with n piles. Empty and singleton inputs take O(1).',
      'O(n)', 'Piles retain n entry references; the heap contains one index per nonempty pile, and output stores n entries. Equal keys can occupy the same pile and pop in reverse arrival order, so this standard lower-bound pile variant is unstable.')
  }

  constructor(model: FixedArray) {
    super(model, 'Patience Sort', { distribution: true, piles: true })
    this.result.patienceSort((event) => this.recordTrace(event))
    this.finish(false)
    this.fitScenes()
  }
}
