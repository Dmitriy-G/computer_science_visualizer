import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import { AnimationSequence } from '../../../../../visualization/AnimationSequence.ts'
import type { LinearInputValues, LinearModel } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { NumericalCSRLayout } from '../NumericalCSRLayout.ts'

export class MultiplyVectorAnimation extends LinearAnimation {
  public static readonly title = 'Multiply by vector'
  public static readonly summary = 'Accumulate A * x from actual stored entries using exact integer arithmetic.'

  public static describe(size: number): AlgorithmInformation {
    const information = AnimationSequence.information(this.title, this.summary, size,
      ['O(s + R + C)', 'O(s + R + C)', 'O(s + R + C)'], 'Parse C vector entries, initialize R output accumulators, and traverse s stored triplets or packed entries. Compressed traversal also visits row/column boundaries. BigInt products and sums are exact; bit width is bounded by the safe-integer inputs and 64-entry limit.',
      ['O(s + R + C)', 'O(s + R + C)', 'O(s + R + C)'], 'This adapter materializes s entry descriptors, C vector values, and R exact output accumulators. Output and traversal descriptors are included in the cost; this is not a constant-space sparse multiply.')
    return { ...information, terms: [
      { symbol: 's', meaning: `Original stored triplet or nonzero count for this run. Original count: ${size}.` },
      { symbol: 'R', meaning: 'Number of matrix rows.' },
      { symbol: 'C', meaning: 'Number of matrix columns.' },
      { symbol: 'O(s + R + C)', meaning: 'An asymptotic upper bound expressed in s, R, C; includes the costs explained above.' },
    ] }
  }

  constructor(model: LinearModel, input: LinearInputValues = {}) {
    super(model, new NumericalCSRLayout(), 'multiply-vector', input, MultiplyVectorAnimation.title, MultiplyVectorAnimation.summary)
  }
}
