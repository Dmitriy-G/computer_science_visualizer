import { ExtendedTreeAnimation } from '../../../../../visualization/ExtendedTreeAnimation.ts'
import type { AdditionalTreeModel, TreeInputValues } from '../../../../../visualization/AdditionalTreeModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { CartesianTreeLayout } from '../CartesianTreeLayout.ts'
export class AppendAnimation extends ExtendedTreeAnimation {
  public static readonly title = 'Append a value'
  public static readonly summary = 'Pop greater values from the monotone right spine and attach the new array position.'
  public static describe(size: number): AlgorithmInformation {
    return {
      name: this.title, summary: this.summary,
      time: { best: 'O(1)', average: 'O(1)', worst: 'O(n)', explanation: 'Each appended node enters and leaves the monotone spine once, giving O(1) amortized append. One append can pop the whole spine. The retained spine is part of the model, not additional working storage.' },
      memory: { best: 'O(1)', average: 'O(1)', worst: 'O(1)', explanation: 'Storage includes the explicit traversal stack and returned output, where applicable. Playback clones and scene snapshots are excluded.' },
      terms: [
        { symbol: 'n', meaning: `Original element count for this run: n = ${size}.` },
        { symbol: 'O(1)', meaning: 'Constant work or additional storage.' },
        { symbol: 'O(n)', meaning: 'Linear work or additional storage.' },
      ],
    }
  }
  constructor(model: AdditionalTreeModel, input: TreeInputValues = {}) {
    super(model, new CartesianTreeLayout(), 'insert', input, AppendAnimation.title, AppendAnimation.summary)
  }
}
