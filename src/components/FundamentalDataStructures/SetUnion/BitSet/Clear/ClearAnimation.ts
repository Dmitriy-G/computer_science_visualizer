import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import { AnimationSequence } from '../../../../../visualization/AnimationSequence.ts'
import type { LinearInputValues, LinearModel } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { BitSetLayout } from '../BitSetLayout.ts'

export class ClearAnimation extends LinearAnimation {
  public static readonly title = 'Clear all bits'
  public static readonly summary = 'Zero each packed word while preserving the logical number of bits.'

  public static describe(size: number): AlgorithmInformation {
    const information = AnimationSequence.information(this.title, this.summary, size,
      ['O(w)', 'O(w)', 'O(w)'], 'Visit w = ceil(n / 32) packed words, including words that are already zero. A zero-length bitset takes O(1).',
      ['O(1)', 'O(1)', 'O(1)'], 'Only a fixed number of local variables are required.')
    return { ...information, terms: [
        { symbol: 'n', meaning: `Original logical size for this run: n = ${size}.` },
        { symbol: 'w', meaning: 'Packed word count: ceil(n / 32).' },
        { symbol: 'O(1)', meaning: 'Constant work or additional storage.' },
        { symbol: 'O(w)', meaning: 'Linear in the packed word count.' },
    ] }
  }

  constructor(model: LinearModel, input: LinearInputValues = {}) {
    super(model, new BitSetLayout(), 'clear', input, ClearAnimation.title, ClearAnimation.summary)
  }
}
