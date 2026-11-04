import { AdditionalTreeAnimation } from '../../../../../visualization/AdditionalTreeAnimation.ts'
import type { AdditionalTreeModel, TreeInputValues } from '../../../../../visualization/AdditionalTreeModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { ASTLayout } from '../ASTLayout.ts'

export class ClearAnimation extends AdditionalTreeAnimation {
  public static readonly title = 'Clear'
  public static readonly summary = 'Disconnect and release each syntax node after its children, preserving the next node ID.'

  public static describe(size: number): AlgorithmInformation {
    return {
      name: this.title,
      summary: this.summary,
      time: { best: 'O(n)', average: 'O(n)', worst: 'O(n)', explanation: 'Each syntax node is released once. Empty clear completes in constant time.' },
      memory: { best: 'O(log n)', average: 'O(log n)', worst: 'O(n)', explanation: 'An explicit traversal stack holds one tree path. Best: balanced binary expressions; average assumes approximately balanced shapes; worst: a unary chain. Animation snapshots and recorded trace events are excluded.' },
      terms: [
        { symbol: 'n', meaning: `Original syntax node count for this run: n = ${size}.` },
        { symbol: 'O(n)', meaning: 'Work or stack storage proportional to the number of syntax nodes.' },
        { symbol: 'O(log n)', meaning: 'Stack storage proportional to balanced expression height.' },
      ],
    }
  }

  constructor(model: AdditionalTreeModel, input: TreeInputValues = {}) {
    super(model, new ASTLayout(), 'clear', input, ClearAnimation.title, ClearAnimation.summary)
  }
}
