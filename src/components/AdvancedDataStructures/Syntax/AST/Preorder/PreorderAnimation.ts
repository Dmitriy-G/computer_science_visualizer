import { AdditionalTreeAnimation } from '../../../../../visualization/AdditionalTreeAnimation.ts'
import type { AdditionalTreeModel, TreeInputValues } from '../../../../../visualization/AdditionalTreeModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { ASTLayout } from '../ASTLayout.ts'

export class PreorderAnimation extends AdditionalTreeAnimation {
  public static readonly title = 'Traverse preorder'
  public static readonly summary = 'Visit the node before its left and right operands. Unary signs are returned as neg or pos.'

  public static describe(size: number): AlgorithmInformation {
    return {
      name: this.title,
      summary: this.summary,
      time: { best: 'O(n)', average: 'O(n)', worst: 'O(n)', explanation: 'Every syntax node is visited once. Empty trees return an empty token list.' },
      memory: { best: 'O(n)', average: 'O(n)', worst: 'O(n)', explanation: 'The returned list contains n tokens; the recursion stack cannot exceed n nodes. Animation snapshots and recorded trace events are excluded.' },
      terms: [
        { symbol: 'n', meaning: `Original syntax node count for this run: n = ${size}.` },
        { symbol: 'O(n)', meaning: 'Work or storage proportional to the number of syntax nodes.' },
      ],
    }
  }

  constructor(model: AdditionalTreeModel, input: TreeInputValues = {}) {
    super(model, new ASTLayout(), 'traverse-preorder', input, PreorderAnimation.title, PreorderAnimation.summary)
  }
}
