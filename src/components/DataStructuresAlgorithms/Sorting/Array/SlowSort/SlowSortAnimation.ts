import { ArraySortingAnimation } from '../ArraySortingAnimation.ts'
import { FixedArray } from '../../../../DataStructuresOverview/Linear/Array/FixedArray.ts'

export class SlowSortAnimation extends ArraySortingAnimation {
  public static describe(size: number) {
    return this.information('Slow Sort', 'Sort both halves, put their larger maximum at the end, and recursively sort the remaining prefix again.', size,
      ['O(n^(log₂ n))', 'O(n^(log₂ n))', 'O(n^(log₂ n))'],
      'The data-independent recurrence is T(n) = T(floor(n/2)) + T(ceil(n/2)) + T(n - 1) + O(1). Displayed bounds are conservative quasipolynomial upper bounds, not tight growth rates; even the best case is superpolynomial. This visualizer accepts at most 12 entries and summarizes repeated operations after at most 64 detailed frames. Larger inputs are rejected unchanged. Empty and singleton inputs take O(1).',
      'O(n)', 'Repeated prefix recursion gives O(n) stack depth. Half-sort calls run sequentially and endpoint exchanges need constant temporary storage. The algorithm is unstable. Trace snapshots are excluded.')
  }

  constructor(model: FixedArray) {
    super(model, 'Slow Sort', { counterHint: 'Slow Sort: at most 12 entries; execute the full recurrence with summarized playback.' })
    let rejection = ''
    const accepted = this.result.slowSort((event) => {
      if (event.kind === 'reject') rejection = event.detail!
      this.recordTrace(event)
    })
    if (accepted) this.finish(false)
    else this.add(5, 'Array unchanged', rejection, 'return original array // sort unfinished', this.layout.create(this.result.getEntries(), this.baseFrame))
    this.fitScenes()
  }
}
