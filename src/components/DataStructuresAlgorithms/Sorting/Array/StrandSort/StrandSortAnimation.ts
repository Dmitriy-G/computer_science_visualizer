import { ArraySortingAnimation } from '../ArraySortingAnimation.ts'
import { FixedArray } from '../../../../FundamentalDataStructures/Linear/Array/FixedArray.ts'

export class StrandSortAnimation extends ArraySortingAnimation {
  public static describe(size: number) {
    return this.information('Strand Sort', 'Extract nondecreasing strands from a linked remaining list and stably merge them into accumulated output.', size,
      ['O(n)', 'O(n²)', 'O(n²)'],
      'Ordered input forms one strand and takes O(n). Reverse order creates singleton strands and quadratic scans and merges. O(n²) is also a conservative average upper bound for any distribution. Linked unlinking is constant time; array splice costs are not hidden. Empty and singleton inputs take O(1).',
      'O(n)', 'One auxiliary linked node per entry uses O(n) storage. Strand extraction and merging relink these nodes without duplicating records. The older accumulated list wins equal-key merge ties, preserving stability.')
  }

  constructor(model: FixedArray) {
    super(model, 'Strand Sort')
    this.result.strandSort((event) => this.recordTrace(event))
    this.finish(true)
    this.fitScenes()
  }
}
