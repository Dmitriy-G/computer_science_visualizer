import { ArraySortingAnimation } from '../ArraySortingAnimation.ts'
import { FixedArray } from '../../../../DataStructuresOverview/Linear/Array/FixedArray.ts'

export class NaturalMergeSortAnimation extends ArraySortingAnimation {
  public static describe(size: number) {
    return this.information('Natural Merge Sort', 'Detect existing monotone runs, reverse strictly decreasing ones, and stably merge adjacent run pairs.', size,
      ['O(n)', 'O(n log n)', 'O(n log n)'],
      'One nondecreasing or strictly decreasing run needs only a linear scan and at most one reversal. For r natural runs, work is O(n + n log r), bounded by O(n log n); average assumes randomly ordered distinct keys. Pairwise merge passes preserve run order. Empty and singleton inputs take O(1).',
      ['O(1)', 'O(n)', 'O(n)'], 'The merge buffer is allocated lazily: a single run needs only constant metadata. Multiple runs use O(n) buffer references and O(r) run descriptors. Strict descending reversal never reverses equal keys, and left-first ties preserve stability. Playback snapshots are excluded.')
  }

  constructor(model: FixedArray) {
    super(model, 'Natural Merge Sort', { counterHint: 'Detect natural runs; reverse strict descents; merge adjacent pairs.' })
    this.result.naturalMergeSort((event) => this.recordTrace(event))
    this.finish(true)
    this.fitScenes()
  }
}
