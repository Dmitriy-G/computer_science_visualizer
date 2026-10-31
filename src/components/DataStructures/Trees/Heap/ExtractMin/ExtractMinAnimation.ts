import { AdditionalTreeAnimation } from '../../../../../visualization/AdditionalTreeAnimation.ts'
import type { AdditionalTreeModel, TreeInputValues } from '../../../../../visualization/AdditionalTreeModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { HeapLayout } from '../HeapLayout.ts'

export class ExtractMinAnimation extends AdditionalTreeAnimation {
  public static readonly title = 'Extract minimum'
  public static readonly summary = 'Remove the root, move the last leaf to the root, and sift down.'

  public static describe(size: number, storage = size, runs = 0): AlgorithmInformation {
    return {
      name: this.title,
      summary: this.summary,
      time: { best: 'O(1)', average: 'O(log n)', worst: 'O(log n)', explanation: 'Best: no swap is needed (including equal-priority heaps). Average assumes independent uniformly ranked priorities; worst descends the full heap height. Empty extraction returns no value.' },
      memory: { best: 'O(1)', average: 'O(1)', worst: 'O(1)', explanation: 'The iterative algorithm uses a few indices and one saved entry. Animation snapshots and traces are excluded.' },
      terms: [
        { symbol: 'n', meaning: `Original element count for this run: n = ${size}.` },
        { symbol: 'O(1)', meaning: 'Constant work or additional storage.' },
        { symbol: 'O(log n)', meaning: 'Work or storage proportional to balanced tree height.' },
      ],
    }
  }

  constructor(model: AdditionalTreeModel, input: TreeInputValues = {}) {
    super(model, new HeapLayout(), 'extract-min', input, ExtractMinAnimation.title, ExtractMinAnimation.summary)
  }
}
