import { ArraySortingAnimation } from '../ArraySortingAnimation.ts'
import { FixedArray } from '../../../../FundamentalDataStructures/Linear/Array/FixedArray.ts'

export class OddEvenMergeSortAnimation extends ArraySortingAnimation {
  public static describe(size: number) {
    return this.information('Odd-Even Merge Sort', 'Sort each half, recursively merge even and odd wires, and repair adjacent outputs using Batcher’s comparator network.', size,
      ['O(n log² n)', 'O(n log² n)', 'O(n log² n)'],
      'All cases execute the same comparator schedule for a given length, giving O(n log² n) sequential work for any input distribution. Conceptual trailing infinity wires are pruned for non-power-of-two lengths without allocating sentinels. Costs count sequential work rather than parallel network depth. Empty and singleton inputs take O(1).',
      'O(log n)', 'The recursive network generator uses a logarithmic stack and constant temporary exchange storage. It generates comparators on demand without storing the network. Long-distance exchanges make this sort unstable.')
  }

  constructor(model: FixedArray) {
    super(model, 'Odd-Even Merge Sort')
    this.result.oddEvenMergeSort((event) => this.recordTrace(event))
    this.finish(false)
  }
}
