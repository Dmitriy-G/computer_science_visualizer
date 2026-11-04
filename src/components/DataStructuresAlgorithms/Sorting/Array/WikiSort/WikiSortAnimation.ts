import { ArraySortingAnimation } from '../ArraySortingAnimation.ts'
import { FixedArray } from '../../../../FundamentalDataStructures/Linear/Array/FixedArray.ts'

export class WikiSortAnimation extends ArraySortingAnimation {
  public static describe(size: number) {
    return this.information('WikiSort', 'Stably merge runs using distinct internal buffer keys, block tags, block rolling, and rotations inside the fixed array.', size,
      ['O(n)', 'O(n log n)', 'O(n log n)'],
      'An ordered-input scan provides linear best time. Otherwise bottom-up block merging takes O(n log n) average and worst time; the average assumes random distinct permutations. This cache-free WikiSort variant uses insertion sorting for small base runs and stable rotation merging when distinct buffer keys are scarce. Empty and singleton inputs take O(1).',
      'O(1)', 'Buffers and block tags borrow array entries; a fixed number of range descriptors and temporary references suffices. No recursive stack or input-sized external buffer is allocated. Distinct buffer keys are restored after each merge level, preserving equal-key order.')
  }

  constructor(model: FixedArray) {
    super(model, 'WikiSort')
    this.result.wikiSort((event) => this.recordTrace(event))
    this.finish(true)
  }
}
