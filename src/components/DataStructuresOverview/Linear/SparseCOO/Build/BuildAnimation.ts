import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import { AnimationSequence } from '../../../../../visualization/AnimationSequence.ts'
import type { LinearInputValues, LinearModel } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { SparseCOOLayout } from '../SparseCOOLayout.ts'

export class BuildAnimation extends LinearAnimation {
  public static readonly title = 'Build from values'
  public static readonly summary = 'Validate the complete shape and row-major values, then replace the storage.'

  public static describe(size: number): AlgorithmInformation {
    const information = AnimationSequence.information(this.title, this.summary, size,
      ['O(N + m)', 'O(N + m)', 'O(N + m)'], 'Scan all N row-major input cells, packing nonzeros; compressed formats also write m + 1 pointers. COO has no pointer array.',
      ['O(N + m)', 'O(N + m)', 'O(N + m)'], 'Parsed dense input and replacement packed arrays use O(N + m) memory. Zero values are omitted, so packed arrays hold at most N entries.')
    return { ...information, terms: [
      { symbol: 'N', meaning: 'Number of logical cells: product of all dimensions.' },
      { symbol: 'm', meaning: 'Major-axis count: columns in CSC, rows in CSR; absent in COO.' },
      { symbol: 'O(N + m)', meaning: 'An asymptotic upper bound expressed in N, m; includes the costs explained above.' },
    ] }
  }

  constructor(model: LinearModel, input: LinearInputValues = {}) {
    super(model, new SparseCOOLayout(), 'build-values', input, BuildAnimation.title, BuildAnimation.summary)
  }
}
