import { ArraySortingAnimation } from '../ArraySortingAnimation.ts'
import { FixedArray } from '../FixedArray.ts'

export class LibrarySortAnimation extends ArraySortingAnimation {
  public static describe(size: number) {
    return this.information('Library Sort', 'Binary-search a separate gapped shelf, shift toward nearby gaps, and rebalance between doubling insertion rounds.', size,
      ['O(n)', 'O(n log n)', 'O(n²)'],
      'An ordered-input scan gives O(n) best time. O(n log n) average assumes uniformly random distinct arrival order, as in gapped-insertion analysis. The app preserves input order rather than randomly permuting it; adversarial arrivals can force O(n²) gap shifts. Empty and singleton inputs take O(1).',
      ['O(1)', 'O(n)', 'O(n)'], 'Ordered input returns before allocation. Otherwise an auxiliary shelf of 2n + 1 slots, rebalance references, and gathered output use O(n) space. Only the shelf has gaps; the fixed model array never grows. Upper-bound insertion preserves ties.')
  }

  constructor(model: FixedArray) {
    super(model, 'Library Sort', { counterHint: 'Separate auxiliary shelf with gaps; the fixed array remains fully occupied.' })
    this.result.librarySort((event) => this.recordTrace(event))
    this.finish(true)
    this.fitScenes()
  }
}
