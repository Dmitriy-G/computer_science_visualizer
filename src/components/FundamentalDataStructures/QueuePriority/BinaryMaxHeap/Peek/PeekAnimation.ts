import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import { AnimationSequence } from '../../../../../visualization/AnimationSequence.ts'
import type { LinearInputValues, LinearModel } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { BinaryMaxHeapLayout } from '../BinaryMaxHeapLayout.ts'

export class PeekAnimation extends LinearAnimation {
  public static readonly title = 'Peek maximum'
  public static readonly summary = 'Read the maximum at the root without changing the heap.'

  public static describe(size: number): AlgorithmInformation {
    const information = AnimationSequence.information(this.title, this.summary, size,
      ['O(1)', 'O(1)', 'O(1)'], 'Read the cached root without traversing or mutating the structure; the empty case returns null.',
      ['O(1)', 'O(1)', 'O(1)'], 'Only a fixed number of local references and indices are needed.')
    return { ...information, terms: [
      { symbol: 'n', meaning: `Original logical entry count for this run: n = ${size}.` },
      { symbol: 'O(1)', meaning: 'Constant work or storage.' },
    ] }
  }

  constructor(model: LinearModel, input: LinearInputValues = {}) {
    super(model, new BinaryMaxHeapLayout(), 'peek', input, PeekAnimation.title, PeekAnimation.summary)
  }
}
