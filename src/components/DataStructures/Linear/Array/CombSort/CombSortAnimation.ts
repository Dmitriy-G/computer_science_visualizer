import { ArraySortingAnimation } from '../ArraySortingAnimation.ts'
import { FixedArray } from '../FixedArray.ts'

export class CombSortAnimation extends ArraySortingAnimation {
  public static describe(size: number) {
    return this.information('Comb Sort', 'Compare and exchange entries across shrinking gaps, then repeat adjacent passes until one makes no swaps.', size,
      ['O(n log n)', 'O(n²)', 'O(n²)'],
      'The 1.3 shrink rule requires logarithmically many passes even on sorted input, giving O(n log n) best time. For uniformly random distinct permutations, the displayed O(n²) average case is a conservative upper bound, not a tight growth rate. At gap one, at most n full adjacent passes finish sorting, giving the quadratic upper bound for both average and worst cases. CombSort11 adjustments are not used. Empty and singleton inputs take O(1).',
      'O(1)', 'A gap, scan indices, a swap flag, and one exchange reference use constant storage. Distant exchanges can reorder equal keys, so Comb Sort is unstable.')
  }

  constructor(model: FixedArray) {
    super(model, 'Comb Sort')
    this.result.combSort((event) => this.recordTrace(event))
    this.finish(false)
  }
}
