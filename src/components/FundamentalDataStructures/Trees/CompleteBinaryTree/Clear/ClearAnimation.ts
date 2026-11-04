import { ExtendedTreeAnimation } from '../../../../../visualization/ExtendedTreeAnimation.ts'
import type { AdditionalTreeModel, TreeInputValues } from '../../../../../visualization/AdditionalTreeModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { CompleteBinaryTreeLayout } from '../CompleteBinaryTreeLayout.ts'
export class ClearAnimation extends ExtendedTreeAnimation {
  public static readonly title = 'Clear'
  public static readonly summary = 'Release the structure so a new example can be built.'
  public static describe(size: number): AlgorithmInformation {
    return {
      name: this.title, summary: this.summary,
      time: { best: 'O(n)', average: 'O(n)', worst: 'O(n)', explanation: 'Release all n level-order entries with one pop each. Empty inputs complete in O(1).' },
      memory: { best: 'O(1)', average: 'O(1)', worst: 'O(1)', explanation: 'Storage includes the explicit traversal stack and returned output, where applicable. Playback clones and scene snapshots are excluded.' },
      terms: [
        { symbol: 'n', meaning: `Original element count for this run: n = ${size}.` },
        { symbol: 'O(n)', meaning: 'Linear work or additional storage.' },
        { symbol: 'O(1)', meaning: 'Constant work or additional storage.' },
      ],
    }
  }
  constructor(model: AdditionalTreeModel, input: TreeInputValues = {}) {
    super(model, new CompleteBinaryTreeLayout(), 'clear', input, ClearAnimation.title, ClearAnimation.summary)
  }
}
