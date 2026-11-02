import { ArraySortingAnimation } from '../ArraySortingAnimation.ts'
import { FixedArray } from '../../../../DataStructuresOverview/Linear/Array/FixedArray.ts'

export class SpreadsortAnimation extends ArraySortingAnimation {
  public static describe(size: number) {
    return this.information('Spreadsort', 'Choose adaptive integer-range bins, permute in place, and switch to comparison sorting for small or deep ranges.', size,
      ['O(n)', 'O(n log n)', 'O(n log n)'],
      'This teaching integer variant skips ordered ranges, chooses up to 16 bins from each actual range, insertion-sorts at most four entries, and heap-sorts if a 2 floor(log2 n) partition-depth budget expires. Ordered input takes O(n). O(n log n) average and worst entries are guaranteed upper bounds for any distribution, rather than tight claims for optimized Boost Spreadsort. Empty and singleton inputs take O(1).',
      ['O(1)', 'O(log n)', 'O(log n)'], 'The ordered fast path needs constant storage. Each active partition retains at most 17 boundary positions; the depth budget bounds recursion to O(log n). Heap fallback is iterative with constant extra space. The permutation and heap fallback are unstable.')
  }

  constructor(model: FixedArray) {
    super(model, 'Spreadsort', { counterHint: 'Adaptive range splits; small insertion leaves; depth-limited heap fallback.' })
    this.result.spreadSort((event) => this.recordTrace(event))
    this.finish(false)
    this.fitScenes()
  }
}
