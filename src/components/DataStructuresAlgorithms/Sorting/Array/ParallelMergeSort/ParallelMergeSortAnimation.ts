import { ArraySortingAnimation } from '../ArraySortingAnimation.ts'
import { FixedArray } from '../../../../FundamentalDataStructures/Linear/Array/FixedArray.ts'

export class ParallelMergeSortAnimation extends ArraySortingAnimation {
  public static describe(size: number) {
    return this.information('Parallel Merge Sort', 'Fork a dependency tree, schedule ready tasks on two virtual workers, and stably merge completed halves.', size,
      ['O(n log n)', 'O(n log n)', 'O(n log n)'],
      'Bounds describe total sequential work in this deterministic two-worker simulation. Balanced splitting and sequential merging cost O(n log n) in every case. This lesson does not run browser threads or promise a wall-clock speedup. With unlimited ideal workers, sequential merges give O(n) span. Empty and singleton inputs take O(1).',
      'O(n)', 'One shared merge buffer and the retained task graph use O(n) auxiliary references. Left-first equal-key merges preserve stability. Playback snapshots are excluded.')
  }

  constructor(model: FixedArray) {
    super(model, 'Parallel Merge Sort', { counterHint: 'Two virtual workers; deterministic fork/join simulation.' })
    this.result.parallelMergeSort((event) => this.recordTrace(event))
    this.finish(true)
    this.fitScenes()
  }
}
