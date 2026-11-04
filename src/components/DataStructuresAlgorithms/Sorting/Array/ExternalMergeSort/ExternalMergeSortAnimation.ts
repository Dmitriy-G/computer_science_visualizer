import { ArraySortingAnimation } from '../ArraySortingAnimation.ts'
import { FixedArray } from '../../../../FundamentalDataStructures/Linear/Array/FixedArray.ts'

export class ExternalMergeSortAnimation extends ArraySortingAnimation {
  public static describe(size: number) {
    return this.information('External Merge Sort', 'Sort three-record RAM chunks into runs, then perform balanced two-way merge passes over four virtual tapes.', size,
      ['O(n log n)', 'O(n log n)', 'O(n log n)'],
      'A fixed three-record run buffer creates ceil(n / 3) runs. Balanced passes merge adjacent runs and copy an unpaired run, giving O(n log n) total record work and logical record I/O in all cases. One record is one I/O unit here; actual blocked disk costs differ. Tapes are simulated in RAM; empty and singleton inputs take O(1).',
      'O(n)', 'Virtual tape files occupy O(n) references in this app. Logical merging needs two input heads and one output record; run formation holds at most three records. No disk files are created. Adjacent-run pairing and left-first ties are stable. Playback snapshots are excluded.')
  }

  constructor(model: FixedArray) {
    super(model, 'External Merge Sort', { counterHint: 'Four virtual tapes; RAM chunks of at most three records; no disk access.' })
    this.result.externalMergeSort((event) => this.recordTrace(event))
    this.finish(true)
    this.fitScenes()
  }
}
