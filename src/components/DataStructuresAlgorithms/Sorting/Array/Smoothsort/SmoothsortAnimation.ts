import { ArraySortingAnimation } from '../ArraySortingAnimation.ts'
import { FixedArray } from '../../../../DataStructuresOverview/Linear/Array/FixedArray.ts'

export class SmoothsortAnimation extends ArraySortingAnimation {
  public static describe(size: number) {
    return this.information('Smoothsort', 'Grow a forest of Leonardo max-heaps, then split and repair its roots as a sorted suffix grows.', size,
      ['O(n)', 'O(n log n)', 'O(n log n)'],
      'Already nondecreasing input needs linear work because heap roots are already ordered. Random distinct permutations give O(n log n) average time; worst-case heap repairs also take O(n log n). Empty and singleton inputs take O(1).',
      'O(1)', 'Iterative sift, trinkle, and semitrinkle repairs use scalar Leonardo sizes and an arithmetic forest-shape encoding. Exchanges can reorder equal keys, so Smoothsort is unstable.')
  }

  constructor(model: FixedArray) {
    super(model, 'Smoothsort')
    this.result.smoothSort((event) => this.recordTrace(event))
    this.finish(false)
  }
}
