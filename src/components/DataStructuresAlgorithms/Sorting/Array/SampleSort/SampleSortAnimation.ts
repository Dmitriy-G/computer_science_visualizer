import { ArraySortingAnimation } from '../ArraySortingAnimation.ts'
import { FixedArray } from '../../../../DataStructuresOverview/Linear/Array/FixedArray.ts'

export class SampleSortAnimation extends ArraySortingAnimation {
  public static describe(size: number) {
    return this.information('Sample Sort', 'Choose splitters from a regular sample, distribute entries into ordered buckets, stably merge-sort each bucket, and concatenate.', size,
      ['O(n log n)', 'O(n log n)', 'O(n log n)'],
      'This sequential teaching variant uses two to four buckets and at most seven evenly spaced sample entries. Binary-search classification is linear at this fixed fan-out. Bottom-up merge sorting within the buckets takes O(n log n) in every case, including unbalanced or all-equal input. The average bound holds for any distribution. Empty and singleton inputs take O(1).',
      'O(n)', 'Buckets, local merge buffers, and concatenated output require O(n) references. The bounded sample and splitters use constant storage. Equal keys go to the same bucket in arrival order and local merges take the left entry on ties, making this variant stable.')
  }

  constructor(model: FixedArray) {
    super(model, 'Sample Sort', { distribution: true, sampleSort: true })
    this.result.sampleSort((event) => this.recordTrace(event))
    this.finish(true)
  }
}
