import { ArraySortingAnimation } from '../ArraySortingAnimation.ts'
import { FixedArray } from '../../../../FundamentalDataStructures/Linear/Array/FixedArray.ts'

export class TimSortAnimation extends ArraySortingAnimation {
  public static describe(size: number) {
    return this.information('TimSort', 'Detect natural ascending or strictly descending runs, extend short runs with stable binary insertion, and merge them using a bounded run stack and galloping.', size,
      ['O(n)', 'O(n log n)', 'O(n log n)'],
      'A single natural run is detected in linear time. Random distinct permutations and worst-case run patterns take O(n log n), with the corrected four-run stack check. This teaching variant uses minrun threshold 8 and a fixed gallop trigger of seven wins rather than OpenJDK\'s tuned adaptive policy. Empty and singleton inputs take O(1).',
      ['O(1)', 'O(n)', 'O(n)'], 'A single run needs constant auxiliary storage. Merges copy the current adjacent runs into an O(n) buffer; the pending run stack has O(log n) entries. Stable ties always choose the left run.')
  }

  constructor(model: FixedArray) {
    super(model, 'TimSort')
    this.result.timSort((event) => this.recordTrace(event))
    this.finish(true)
  }
}
