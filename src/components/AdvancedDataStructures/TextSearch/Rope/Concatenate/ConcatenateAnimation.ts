import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import { AnimationSequence } from '../../../../../visualization/AnimationSequence.ts'
import type { LinearInputValues, LinearModel } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { RopeLayout } from '../RopeLayout.ts'

export class ConcatenateAnimation extends LinearAnimation {
  public static readonly title = 'Concatenate text'
  public static readonly summary = 'Build chunks for appended text and join them to the existing rope.'

  public static describe(size: number): AlgorithmInformation {
    const information = AnimationSequence.information(this.title, this.summary, size,
      ['O(m)', 'O(m + log n)', 'O(m + log n)'], 'Building chunks costs O(m); joining equal-height trees is constant, while arbitrary height differences can require logarithmic path rebuilding. The average bound is conservative without a height distribution.',
      ['O(m + log n)', 'O(m + log n)', 'O(m + log n)'], 'New text chunks and immutable join paths allocate O(m + log n) storage; the old text is shared.')
    return { ...information, terms: [
        { symbol: 'n', meaning: `Original logical size for this run: n = ${size}.` },
        { symbol: 'm', meaning: 'Number of characters supplied for insertion or search; each request allows 1 to 32 ASCII characters.' },
        { symbol: 'O(m + log n)', meaning: 'New-text work or storage plus logarithmic tree paths.' },
        { symbol: 'O(m)', meaning: 'Linear in the supplied text length.' },
    ] }
  }

  constructor(model: LinearModel, input: LinearInputValues = {}) {
    super(model, new RopeLayout(), 'concatenate', input, ConcatenateAnimation.title, ConcatenateAnimation.summary)
  }
}
