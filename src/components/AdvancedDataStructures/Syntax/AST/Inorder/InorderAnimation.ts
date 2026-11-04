import { AdditionalTreeAnimation } from '../../../../../visualization/AdditionalTreeAnimation.ts'
import type { AdditionalTreeModel, TreeInputValues } from '../../../../../visualization/AdditionalTreeModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { ASTLayout } from '../ASTLayout.ts'

export class InorderAnimation extends AdditionalTreeAnimation {
  public static readonly title = 'Traverse inorder'
  public static readonly summary = 'Visit binary nodes between their operands and unary signs before their operand. This token order does not reconstruct parentheses.'

  public static describe(size: number): AlgorithmInformation {
    return {
      name: this.title,
      summary: this.summary,
      time: { best: 'O(n)', average: 'O(n)', worst: 'O(n)', explanation: 'Every syntax node is visited once. Parentheses are not AST nodes, and empty trees return an empty list.' },
      memory: { best: 'O(n)', average: 'O(n)', worst: 'O(n)', explanation: 'The returned list contains n tokens and includes every unary node; recursion is bounded by n. Animation snapshots and recorded trace events are excluded.' },
      terms: [
        { symbol: 'n', meaning: `Original syntax node count for this run: n = ${size}.` },
        { symbol: 'O(n)', meaning: 'Work or storage proportional to the number of syntax nodes.' },
      ],
    }
  }

  constructor(model: AdditionalTreeModel, input: TreeInputValues = {}) {
    super(model, new ASTLayout(), 'traverse-inorder', input, InorderAnimation.title, InorderAnimation.summary)
  }
}
