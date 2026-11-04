import { ExtendedTreeAnimation } from '../../../../../visualization/ExtendedTreeAnimation.ts'
import type { AdditionalTreeModel, TreeInputValues } from '../../../../../visualization/AdditionalTreeModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { SparseTableLayout } from '../SparseTableLayout.ts'
export class BuildAnimation extends ExtendedTreeAnimation {
  public static readonly title = 'Build from values'
  public static readonly summary = 'Precompute minima for every available power-of-two interval.'
  public static describe(size: number): AlgorithmInformation {
    return {
      name: this.title, summary: this.summary,
      time: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)', explanation: 'Build tabulates all available power-of-two intervals and integer logarithms. A query reads exactly two cached intervals; minimum is idempotent, so overlap is safe. These are bounds for every input distribution; empty tables cannot be queried.' },
      memory: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)', explanation: 'Storage includes the explicit traversal stack and returned output, where applicable. Playback clones and scene snapshots are excluded.' },
      terms: [
        { symbol: 'n', meaning: `Number of newly supplied array values; the current example has ${size} values.` },
        { symbol: 'O(n log n)', meaning: 'Input size times its logarithm.' },
      ],
    }
  }
  constructor(model: AdditionalTreeModel, input: TreeInputValues = {}) {
    super(model, new SparseTableLayout(), 'build-values', input, BuildAnimation.title, BuildAnimation.summary)
  }
}
