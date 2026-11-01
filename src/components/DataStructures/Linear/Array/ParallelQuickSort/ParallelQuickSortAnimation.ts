import { ArraySortingAnimation } from '../ArraySortingAnimation.ts'
import { FixedArray } from '../FixedArray.ts'

export class ParallelQuickSortAnimation extends ArraySortingAnimation {
  public static describe(size: number) {
    return this.information('Parallel QuickSort', 'Partition around a middle-slot pivot, then schedule independent less-than and greater-than tasks on two virtual workers.', size,
      ['O(n)', 'O(n log n)', 'O(n²)'],
      'Bounds describe total work, not parallel elapsed time. Three-way partitioning is O(n) for all-equal input. Average O(n log n) assumes randomly ordered distinct keys. The deterministic middle-slot pivot can produce adversarial O(n²) work. Worker lanes are simulated sequentially; empty and singleton inputs take O(1).',
      ['O(1)', 'O(n)', 'O(n)'], 'All-equal input creates one task. The ready queue and retained dependency graph use O(n) space for typical distinct input and in the worst case. Swaps are in place, but this teaching scheduler retains completed tasks. Equal-key order is not guaranteed. Playback snapshots are excluded.')
  }

  constructor(model: FixedArray) {
    super(model, 'Parallel QuickSort', { counterHint: 'Two virtual workers; deterministic fork/join simulation.' })
    this.result.parallelQuickSort((event) => this.recordTrace(event))
    this.finish(false)
    this.fitScenes()
  }
}
