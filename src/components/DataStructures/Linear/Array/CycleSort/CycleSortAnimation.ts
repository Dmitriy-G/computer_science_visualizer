import { ArraySortingAnimation } from '../ArraySortingAnimation.ts'
import { FixedArray } from '../FixedArray.ts'

export class CycleSortAnimation extends ArraySortingAnimation {
  public static describe(size: number) {
    return this.information('Cycle Sort', 'Count smaller keys to locate each destination, skip equal keys, and rotate displaced entries through cycles with few array writes.', size,
      ['O(n²)', 'O(n²)', 'O(n²)'],
      'Even sorted input scans every remaining suffix to locate destinations, taking O(n²) best time. Recounting ranks during cycles also gives O(n²) average and worst time; average assumes random distinct permutations. Array writes are minimized by leaving already correct values untouched and writing misplaced values to their destinations. Empty and singleton inputs take O(1).',
      'O(1)', 'Only one held entry, a displaced reference, and loop indices are needed. Duplicate keys are skipped before writing a destination, but their relative order can change, so Cycle Sort is unstable.')
  }

  constructor(model: FixedArray) {
    super(model, 'Cycle Sort')
    this.result.cycleSort((event) => this.recordTrace(event))
    this.finish(false)
  }
}
