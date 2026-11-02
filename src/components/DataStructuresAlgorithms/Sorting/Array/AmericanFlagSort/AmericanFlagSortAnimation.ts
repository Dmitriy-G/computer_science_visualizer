import { ArraySortingAnimation } from '../ArraySortingAnimation.ts'
import { FixedArray } from '../../../../DataStructuresOverview/Linear/Array/FixedArray.ts'

export class AmericanFlagSortAnimation extends ArraySortingAnimation {
  public static describe(size: number) {
    return this.information('American Flag Sort', 'Count most-significant hexadecimal digits and cyclically permute entries into contiguous bins in place.', size,
      ['O(n)', 'O(nd)', 'O(nd)'],
      'Subtract the observed minimum with exact BigInt arithmetic, then process up to d hexadecimal digits from most to least significant. With a fixed radix of 16, O(nd) bounds total partition work for every input distribution. All-equal keys need only the O(n) bounds scan. Empty and singleton inputs take O(1).',
      ['O(1)', 'O(d)', 'O(d)'], 'Each recursive level retains constant-size 16-bin counts and boundaries. At most d levels use O(d) space; the all-equal fast path uses O(1). This array permutation is in place and unstable. Safe integer offsets need at most 14 hexadecimal digits.',
      [{ symbol: 'd', meaning: 'Number of equal-width hexadecimal digits in max - min, at least one and at most 14 for safe integer keys.' }])
  }

  constructor(model: FixedArray) {
    super(model, 'American Flag Sort', { counterHint: 'In-place MSD radix sorting; 16 hexadecimal bins; exact integer offsets.' })
    this.result.americanFlagSort((event) => this.recordTrace(event))
    this.finish(false)
    this.fitScenes()
  }
}
