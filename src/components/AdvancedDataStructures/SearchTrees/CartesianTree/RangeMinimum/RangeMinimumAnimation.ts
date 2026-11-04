import { ExtendedTreeAnimation } from '../../../../../visualization/ExtendedTreeAnimation.ts'
import type { AdditionalTreeModel, TreeInputValues } from '../../../../../visualization/AdditionalTreeModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { CartesianTreeLayout } from '../CartesianTreeLayout.ts'
export class RangeMinimumAnimation extends ExtendedTreeAnimation {
  public static readonly title = 'Range minimum'
  public static readonly summary = 'Find the minimum value in an inclusive zero-based index range.'
  public static describe(size: number): AlgorithmInformation {
    return {
      name: this.title, summary: this.summary,
      time: { best: 'O(1)', average: 'O(n)', worst: 'O(n)', explanation: 'Range minimum descends by array index to the interval\'s lowest common ancestor. A root-spanning range is constant; a chain may need O(n). Average O(n) is a conservative upper bound without distribution assumptions.' },
      memory: { best: 'O(1)', average: 'O(1)', worst: 'O(1)', explanation: 'Storage includes the explicit traversal stack and returned output, where applicable. Playback clones and scene snapshots are excluded.' },
      terms: [
        { symbol: 'n', meaning: `Original element count for this run: n = ${size}.` },
        { symbol: 'O(1)', meaning: 'Constant work or additional storage.' },
        { symbol: 'O(n)', meaning: 'Linear work or additional storage.' },
      ],
    }
  }
  constructor(model: AdditionalTreeModel, input: TreeInputValues = {}) {
    super(model, new CartesianTreeLayout(), 'range-min', input, RangeMinimumAnimation.title, RangeMinimumAnimation.summary)
  }
}
