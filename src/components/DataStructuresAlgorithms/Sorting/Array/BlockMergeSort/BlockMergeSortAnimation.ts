import { ArraySortingAnimation } from '../ArraySortingAnimation.ts'
import { FixedArray } from '../../../../FundamentalDataStructures/Linear/Array/FixedArray.ts'

export class BlockMergeSortAnimation extends ArraySortingAnimation {
  public static describe(size: number) {
    return this.information('Block Merge Sort', 'Explore a buffered block-wise multiway merge variant: sort square-root-sized blocks, then merge their heads through a min-heap into stable output.', size,
      ['O(n)', 'O(n log n)', 'O(n log n)'],
      'An initial ordered-input scan provides a linear best case. Sorting blocks costs O(n log blockSize); merging through a heap costs O(n log blockCount), giving O(n log n) average and worst time. Average assumes random distinct permutations. Empty and singleton inputs take O(1). This is a buffered multiway teaching variant, not the constant-space internal-buffer block-sort algorithm.',
      ['O(1)', 'O(n)', 'O(n)'], 'Working storage and merged output hold O(n) entry references; block cursors and the head heap use O(√n). Ordered input needs no buffers. Equal keys are ordered by their original block positions, preserving stability without requiring distinct keys.')
  }

  constructor(model: FixedArray) {
    super(model, 'Block Merge Sort')
    this.result.blockMergeSort((event) => this.recordTrace(event))
    this.finish(true)
  }
}
