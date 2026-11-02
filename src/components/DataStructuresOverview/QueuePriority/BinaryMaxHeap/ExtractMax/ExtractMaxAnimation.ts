import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import { AnimationSequence } from '../../../../../visualization/AnimationSequence.ts'
import type { LinearInputValues, LinearModel } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { BinaryMaxHeapLayout } from '../BinaryMaxHeapLayout.ts'

export class ExtractMaxAnimation extends LinearAnimation {
  public static readonly title = 'Extract maximum'
  public static readonly summary = 'Remove the maximum root, replace it with the last leaf, and sift downward.'

  public static describe(size: number): AlgorithmInformation {
    const information = AnimationSequence.information(this.title, this.summary, size,
      ['O(1)', 'O(log n)', 'O(log n)'], 'An already ordered replacement can stop immediately. O(log n) is a conservative average and worst bound for restoring the complete binary heap; empty and singleton heaps finish in O(1).',
      ['O(1)', 'O(1)', 'O(1)'], 'Only a fixed number of local references and indices are needed.')
    return { ...information, terms: [
      { symbol: 'n', meaning: `Original logical entry count for this run: n = ${size}.` },
      { symbol: 'O(1)', meaning: 'Constant work or storage.' },
      { symbol: 'O(log n)', meaning: 'Logarithmic in the original entry count.' },
    ] }
  }

  constructor(model: LinearModel, input: LinearInputValues = {}) {
    super(model, new BinaryMaxHeapLayout(), 'extract-max', input, ExtractMaxAnimation.title, ExtractMaxAnimation.summary)
  }
}
