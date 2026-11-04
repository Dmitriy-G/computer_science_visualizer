import { ArraySortingAnimation } from '../ArraySortingAnimation.ts'
import { FixedArray } from '../../../../FundamentalDataStructures/Linear/Array/FixedArray.ts'

export class InterpolationSortAnimation extends ArraySortingAnimation {
  public static describe(size: number) {
    return this.information('Interpolation Sort', 'Estimate ranks with exact interpolation, place stable histogram intervals into output, and insertion-sort collisions.', size,
      ['O(n)', 'O(n)', 'O(n²)'],
      'The all-equal bounds scan takes O(n). With n value intervals and independent uniformly distributed keys, constant expected occupancy gives O(n) average work. Clustered keys can leave O(n²) insertion cleanup. Empty and singleton inputs take O(1).',
      ['O(1)', 'O(n)', 'O(n)'], 'All-equal input returns before allocation. Otherwise n histogram cells and n output references use O(n) auxiliary space. Forward histogram placement and strict insertion exchanges preserve equal-key order.')
  }

  constructor(model: FixedArray) {
    super(model, 'Interpolation Sort', { counterHint: 'Stable interpolation histogram plus collision cleanup; exact integer arithmetic.' })
    this.result.interpolationSort((event) => this.recordTrace(event))
    this.finish(true)
    this.fitScenes()
  }
}
