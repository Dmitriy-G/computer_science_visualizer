import { ArraySortingAnimation } from '../ArraySortingAnimation.ts'
import { FixedArray } from '../../../../FundamentalDataStructures/Linear/Array/FixedArray.ts'

export class FlashsortAnimation extends ArraySortingAnimation {
  public static describe(size: number) {
    return this.information('Flashsort', 'Count value-range classes, cycle entries into their class regions, and finish with insertion exchanges.', size,
      ['O(n)', 'O(n)', 'O(n²)'],
      'The bounds scan is linear, including the all-equal best case. With about 0.43n classes and independent uniformly distributed keys, expected class occupancy and insertion cleanup give O(n) average work. Clustered keys can leave quadratic insertion cleanup. Empty and singleton inputs take O(1).',
      ['O(1)', 'O(n)', 'O(n)'], 'All-equal input returns before allocating classes. Otherwise the class-boundary array has about 0.43n cells and cycles hold one entry, using O(n) extra memory. No entry-sized visited array is used. Class permutation can reorder ties, so this variant is unstable.')
  }

  constructor(model: FixedArray) {
    super(model, 'Flashsort')
    this.result.flashSort((event) => this.recordTrace(event))
    this.finish(false)
    this.fitScenes()
  }
}
