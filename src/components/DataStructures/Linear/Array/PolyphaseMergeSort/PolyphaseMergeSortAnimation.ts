import { ArraySortingAnimation } from '../ArraySortingAnimation.ts'
import { FixedArray } from '../FixedArray.ts'

export class PolyphaseMergeSortAnimation extends ArraySortingAnimation {
  public static describe(size: number) {
    return this.information('Polyphase Merge Sort', 'Distribute sorted runs in Fibonacci quotas over two tapes and rotate a third empty tape through polyphase merges.', size,
      ['O(n log n)', 'O(n log n)', 'O(n log n)'],
      'Three-record chunks form initial runs. Consecutive Fibonacci quotas and empty dummy runs establish the three-tape schedule. Each phase exhausts an input tape and rotates its role without redistribution. Total record work is O(n log n) with this fixed chunk size. Dummy transfers perform no record I/O. Empty and singleton inputs take O(1).',
      'O(n)', 'All virtual tape data and run descriptors occupy O(n) references in this app. Logical merge RAM holds two input heads and one output record; tapes are simulated, with no disk access. Simple left-tape tie handling can reorder equal keys after tape rotation, so this variant is unstable. Playback snapshots are excluded.')
  }

  constructor(model: FixedArray) {
    super(model, 'Polyphase Merge Sort', { counterHint: 'Three virtual tapes; Fibonacci run quotas and empty dummy runs; no disk access.' })
    this.result.polyphaseMergeSort((event) => this.recordTrace(event))
    this.finish(false)
    this.fitScenes()
  }
}
