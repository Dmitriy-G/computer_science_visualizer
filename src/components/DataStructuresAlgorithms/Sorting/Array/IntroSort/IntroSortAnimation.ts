import { ArraySortingAnimation } from '../ArraySortingAnimation.ts'
import { FixedArray } from '../../../../FundamentalDataStructures/Linear/Array/FixedArray.ts'

export class IntroSortAnimation extends ArraySortingAnimation {
  public static describe(size: number) {
    return this.information('IntroSort', 'Combine median-of-three quicksort partitioning with a depth budget, iterative heapsort fallback, and binary insertion for partitions of at most four entries.', size,
      ['O(n log n)', 'O(n log n)', 'O(n log n)'],
      'Partition paths are limited to 2 floor(log2 n) levels. At that limit, heapsort guarantees O(n log n) worst-case time. Average assumes uniformly random distinct permutations. A four-entry cutoff exposes the hybrid on the small teaching array. Empty and singleton inputs take O(1).',
      ['O(1)', 'O(log n)', 'O(log n)'], 'Sort the smaller partition recursively and iterate over the larger, bounding the stack by O(log n). Strongly one-sided partitions need only constant stack space. The heapsort fallback is iterative; the full algorithm is unstable.')
  }

  constructor(model: FixedArray) {
    super(model, 'IntroSort')
    this.result.introSort((event) => this.recordTrace(event))
    this.finish(false)
  }
}
