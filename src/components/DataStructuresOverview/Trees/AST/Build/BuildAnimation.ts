import { AdditionalTreeAnimation } from '../../../../../visualization/AdditionalTreeAnimation.ts'
import type { AdditionalTreeModel, TreeInputValues } from '../../../../../visualization/AdditionalTreeModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { ASTLayout } from '../ASTLayout.ts'

export class BuildAnimation extends AdditionalTreeAnimation {
  public static readonly title = 'Build from expression'
  public static readonly summary = 'Parse an arithmetic expression and connect its syntax nodes according to precedence and grouping.'

  public static describe(size: number): AlgorithmInformation {
    return {
      name: this.title,
      summary: this.summary,
      time: { best: 'O(m)', average: 'O(m)', worst: 'O(m)', explanation: 'Read all m source characters and create at most m nodes. The old root reference is replaced; reclaiming its unused storage is outside parsing.' },
      memory: { best: 'O(m)', average: 'O(m)', worst: 'O(m)', explanation: 'Parsed descriptors, newly allocated syntax nodes, and parser/build stacks are bounded by m. Animation snapshots and recorded trace events are excluded.' },
      terms: [
        { symbol: 'm', meaning: 'Length of the new expression, including whitespace; at most 128 characters.' },
        { symbol: 'O(m)', meaning: 'Work or storage proportional to the expression length.' },
      ],
    }
  }

  constructor(model: AdditionalTreeModel, input: TreeInputValues = {}) {
    super(model, new ASTLayout(), 'build-expression', input, BuildAnimation.title, BuildAnimation.summary)
  }
}
