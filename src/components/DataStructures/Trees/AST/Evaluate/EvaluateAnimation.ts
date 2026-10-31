import { AdditionalTreeAnimation } from '../../../../../visualization/AdditionalTreeAnimation.ts'
import type { AdditionalTreeModel, TreeInputValues } from '../../../../../visualization/AdditionalTreeModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { ASTLayout } from '../ASTLayout.ts'

export class EvaluateAnimation extends AdditionalTreeAnimation {
  public static readonly title = 'Evaluate expression'
  public static readonly summary = 'Evaluate operand subtrees, then apply each unary or binary operator. Show the numeric result or the arithmetic error.'

  public static describe(size: number): AlgorithmInformation {
    return {
      name: this.title,
      summary: this.summary,
      time: { best: 'O(n)', average: 'O(n)', worst: 'O(n)', explanation: 'A successful evaluation visits every node. Arithmetic errors can stop early; an empty AST returns null.' },
      memory: { best: 'O(log n)', average: 'O(log n)', worst: 'O(n)', explanation: 'The recursion stack follows tree height. Best: balanced binary expressions; average assumes approximately balanced expression shapes; worst: a chain of unary operators. A literal alone needs constant space. Animation snapshots and recorded trace events are excluded.' },
      terms: [
        { symbol: 'n', meaning: `Original syntax node count for this run: n = ${size}.` },
        { symbol: 'O(n)', meaning: 'Work or recursion storage proportional to the number of syntax nodes.' },
        { symbol: 'O(log n)', meaning: 'Stack storage proportional to the height of a balanced expression tree.' },
      ],
    }
  }

  constructor(model: AdditionalTreeModel, input: TreeInputValues = {}) {
    super(model, new ASTLayout(), 'evaluate', input, EvaluateAnimation.title, EvaluateAnimation.summary)
  }
}
