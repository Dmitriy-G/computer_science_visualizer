import { ArraySortingAnimation } from '../ArraySortingAnimation.ts'
import { FixedArray } from '../FixedArray.ts'

export class BitonicSortAnimation extends ArraySortingAnimation {
  public static describe(size: number) {
    return this.information('Bitonic Sort', 'Build ranges that run in opposite directions, then compare across decreasing distances to produce ascending output.', size,
      ['O(n log² n)', 'O(n log² n)', 'O(n log² n)'],
      'The network schedule depends only on length, so best, average, and worst sequential work are O(n log² n) for any input distribution. The arbitrary-length construction merges at the greatest power of two below each range length and needs no padding. Costs count sequential comparator work. Empty and singleton inputs take O(1).',
      'O(log n)', 'Recursive sorting and merging use a logarithmic stack plus one temporary exchange reference. No input-sized working buffer is allocated. Nonadjacent exchanges and descending intermediate ranges make Bitonic Sort unstable.')
  }

  constructor(model: FixedArray) {
    super(model, 'Bitonic Sort')
    this.result.bitonicSort((event) => this.recordTrace(event))
    this.finish(false)
  }
}
