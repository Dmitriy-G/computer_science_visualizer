import { ArraySortingAnimation } from '../ArraySortingAnimation.ts'
import { FixedArray } from '../../../../FundamentalDataStructures/Linear/Array/FixedArray.ts'

export class StoogeSortAnimation extends ArraySortingAnimation {
  public static describe(size: number) {
    return this.information('Stooge Sort', 'Compare range endpoints, then recursively sort the first two-thirds, last two-thirds, and first two-thirds again.', size,
      ['O(n^2.71)', 'O(n^2.71)', 'O(n^2.71)'],
      'The data-independent recurrence is T(n) = 3T(ceil(2n/3)) + O(1), with the exact child sizes defined by removing floor(n/3). The exponent log base 1.5 of 3 is about 2.7095; 2.71 is a rounded upper bound. This visualizer accepts at most 12 entries and summarizes repeated operations after at most 64 detailed frames. Larger inputs are rejected unchanged. Empty and singleton inputs take O(1).',
      'O(log n)', 'The overlapping recursive calls execute sequentially, so stack depth is O(log n), not the number of calls. Endpoint exchanges use constant extra storage. The sort is unstable. Trace snapshots are excluded.')
  }

  constructor(model: FixedArray) {
    super(model, 'Stooge Sort')
    let rejection = ''
    const accepted = this.result.stoogeSort((event) => {
      if (event.kind === 'reject') rejection = event.detail!
      this.recordTrace(event)
    })
    if (accepted) this.finish(false)
    else this.add(5, 'Array unchanged', rejection, 'return original array // sort unfinished', this.layout.create(this.result.getEntries(), this.baseFrame))
    this.fitScenes()
  }
}
