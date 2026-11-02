import { ExtendedTreeAnimation } from '../../../../../visualization/ExtendedTreeAnimation.ts'
import type { AdditionalTreeModel, TreeInputValues } from '../../../../../visualization/AdditionalTreeModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { SuffixTreeLayout } from '../SuffixTreeLayout.ts'
export class BuildAnimation extends ExtendedTreeAnimation {
  public static readonly title = 'Build from text'
  public static readonly summary = 'Build all suffixes using compressed source-text edge ranges and a unique terminator.'
  public static describe(size: number): AlgorithmInformation {
    return {
      name: this.title, summary: this.summary,
      time: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)', explanation: 'n is the new source-text length. Naive compressed suffix insertion takes O(n²) worst-case comparisons and O(n) edge nodes with shared source-text ranges. Distinct starting characters need only O(n); average O(n²) is a conservative bound.' },
      memory: { best: 'O(n)', average: 'O(n)', worst: 'O(n)', explanation: 'Storage includes the explicit traversal stack and returned output, where applicable. Playback clones and scene snapshots are excluded.' },
      terms: [
        { symbol: 'n', meaning: `Number of newly supplied source characters; the current example has ${size} characters.` },
        { symbol: 'O(n)', meaning: 'Linear work or additional storage.' },
        { symbol: 'O(n²)', meaning: 'Quadratic work in the input size.' },
      ],
    }
  }
  constructor(model: AdditionalTreeModel, input: TreeInputValues = {}) {
    super(model, new SuffixTreeLayout(), 'build-text', input, BuildAnimation.title, BuildAnimation.summary)
  }
}
