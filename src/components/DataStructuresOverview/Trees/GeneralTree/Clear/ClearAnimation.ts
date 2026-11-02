import { ExtendedTreeAnimation } from '../../../../../visualization/ExtendedTreeAnimation.ts'
import type { AdditionalTreeModel, TreeInputValues } from '../../../../../visualization/AdditionalTreeModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { GeneralTreeLayout } from '../GeneralTreeLayout.ts'
export class ClearAnimation extends ExtendedTreeAnimation {
  public static readonly title = 'Clear'
  public static readonly summary = 'Release the structure so a new example can be built.'
  public static describe(size: number): AlgorithmInformation {
    return {
      name: this.title, summary: this.summary,
      time: { best: 'O(n)', average: 'O(n)', worst: 'O(n)', explanation: 'Visit every node once in postorder, processing rightmost children first so each detached child uses a constant-time pop. Empty inputs finish in O(1).' },
      memory: { best: 'O(log n)', average: 'O(n)', worst: 'O(n)', explanation: 'A balanced binary shape needs a logarithmic postorder stack; a chain or wide general-tree frontier can need linear space. Average O(n) is a conservative upper bound without a shape distribution. Playback snapshots are excluded.' },
      terms: [
        { symbol: 'O(log n)', meaning: 'Storage proportional to a logarithmic tree height.' },
        { symbol: 'n', meaning: `Original element count for this run: n = ${size}.` },
        { symbol: 'O(n)', meaning: 'Linear work or additional storage.' },
        { symbol: 'O(1)', meaning: 'Constant work or additional storage.' },
      ],
    }
  }
  constructor(model: AdditionalTreeModel, input: TreeInputValues = {}) {
    super(model, new GeneralTreeLayout(), 'clear', input, ClearAnimation.title, ClearAnimation.summary)
  }
}
