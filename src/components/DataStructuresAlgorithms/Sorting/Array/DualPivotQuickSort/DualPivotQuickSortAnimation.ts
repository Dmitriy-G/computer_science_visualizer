import { ArraySortingAnimation } from '../ArraySortingAnimation.ts'
import { FixedArray } from '../../../../FundamentalDataStructures/Linear/Array/FixedArray.ts'

export class DualPivotQuickSortAnimation extends ArraySortingAnimation {
  public static describe(size: number) {
    return this.information('Dual-Pivot QuickSort', 'Use ordered endpoint pivots p and q to partition into keys below p, keys between p and q, and keys above q. Skip the middle when both pivots are equal.', size,
      ['O(n)', 'O(n log n)', 'O(n²)'],
      'All-equal input needs a single linear partition. Average assumes uniformly random distinct permutations. Sorted or reverse-sorted distinct input produces quadratic work with these deterministic endpoint pivots. This lesson omits the sampling, adaptive merging, and heap fallback of the OpenJDK production hybrid. Partitions of up to three entries use insertion; empty and singleton inputs take O(1).',
      ['O(1)', 'O(log n)', 'O(log n)'], 'Recurse only into the two smaller ranges and iterate over the largest. Each recursive child has at most half the current entries, bounding stack space even when time is quadratic. Equal entries may change order.')
  }

  constructor(model: FixedArray) {
    super(model, 'Dual-Pivot QuickSort')
    this.result.dualPivotQuickSort((event) => this.recordTrace(event))
    this.finish(false)
  }
}
