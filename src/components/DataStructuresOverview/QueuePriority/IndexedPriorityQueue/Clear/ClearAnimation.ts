import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import { AnimationSequence } from '../../../../../visualization/AnimationSequence.ts'
import type { LinearInputValues, LinearModel } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { IndexedPriorityQueueLayout } from '../IndexedPriorityQueueLayout.ts'

export class ClearAnimation extends LinearAnimation {
  public static readonly title = 'Clear'
  public static readonly summary = 'Release heap leaves and their inverse-position entries.'

  public static describe(size: number): AlgorithmInformation {
    const information = AnimationSequence.information(this.title, this.summary, size,
      ['O(n)', 'O(n)', 'O(n²)'], 'Each entry and mapping is removed once, giving expected O(n) work. A conservative Map model permits linear table maintenance per deletion; an empty queue takes O(1).',
      ['O(1)', 'O(1)', 'O(1)'], 'Only a fixed number of local references and indices are needed.')
    return { ...information, terms: [
      { symbol: 'n', meaning: `Original logical entry count for this run: n = ${size}.` },
      { symbol: 'O(1)', meaning: 'Constant work or storage.' },
      { symbol: 'O(n)', meaning: 'Linear in the original entry count.' },
      { symbol: 'O(n²)', meaning: 'Quadratic in the original entry count.' },
    ] }
  }

  constructor(model: LinearModel, input: LinearInputValues = {}) {
    super(model, new IndexedPriorityQueueLayout(), 'clear', input, ClearAnimation.title, ClearAnimation.summary)
  }
}
