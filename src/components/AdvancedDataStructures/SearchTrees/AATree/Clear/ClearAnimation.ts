import { ExtendedTreeAnimation } from '../../../../../visualization/ExtendedTreeAnimation.ts'
import type { AdditionalTreeModel, TreeInputValues } from '../../../../../visualization/AdditionalTreeModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { AATreeLayout } from '../AATreeLayout.ts'
export class ClearAnimation extends ExtendedTreeAnimation {
  public static readonly title = 'Clear'
  public static readonly summary = 'Release the structure so a new example can be built.'
  public static describe(size: number): AlgorithmInformation {
    return {
      name: this.title, summary: this.summary,
      time: { best: 'O(n)', average: 'O(n)', worst: 'O(n)', explanation: 'Explicit postorder traversal detaches every node or page once. Empty inputs complete in O(1). The tree is being discarded, so no balancing repairs are required.' },
      memory: { best: 'O(log n)', average: 'O(log n)', worst: 'O(log n)', explanation: 'The explicit postorder stack is bounded by the logarithmic height of this balanced tree. Empty inputs use constant storage. Playback snapshots are excluded.' },
      terms: [
        { symbol: 'O(log n)', meaning: 'Storage proportional to a logarithmic tree height.' },
        { symbol: 'n', meaning: `Original element count for this run: n = ${size}.` },
        { symbol: 'O(n)', meaning: 'Linear work or additional storage.' },
      ],
    }
  }
  constructor(model: AdditionalTreeModel, input: TreeInputValues = {}) {
    super(model, new AATreeLayout(), 'clear', input, ClearAnimation.title, ClearAnimation.summary)
  }
}
