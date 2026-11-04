import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import { AnimationSequence } from '../../../../../visualization/AnimationSequence.ts'
import type { LinearInputValues, LinearModel } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { PriorityQueueLayout } from '../PriorityQueueLayout.ts'

export class ClearAnimation extends LinearAnimation {
  public static readonly title = 'Clear'
  public static readonly summary = 'Release the stored entries one at a time.'

  public static describe(size: number): AlgorithmInformation {
    const information = AnimationSequence.information(this.title, this.summary, size,
      ['O(n)', 'O(n)', 'O(n)'], 'Visit and release each of the n existing entries once; empty input finishes in O(1).',
      ['O(1)', 'O(1)', 'O(1)'], 'Only a fixed number of local references and indices are needed.')
    return { ...information, terms: [
      { symbol: 'n', meaning: `Original logical entry count for this run: n = ${size}.` },
      { symbol: 'O(1)', meaning: 'Constant work or storage.' },
      { symbol: 'O(n)', meaning: 'Linear in the original entry count.' },
    ] }
  }

  constructor(model: LinearModel, input: LinearInputValues = {}) {
    super(model, new PriorityQueueLayout(), 'clear', input, ClearAnimation.title, ClearAnimation.summary)
  }
}
