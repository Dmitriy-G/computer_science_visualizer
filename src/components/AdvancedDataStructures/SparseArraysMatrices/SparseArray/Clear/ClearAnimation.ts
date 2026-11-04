import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import { AnimationSequence } from '../../../../../visualization/AnimationSequence.ts'
import type { LinearInputValues, LinearModel } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { SparseArrayLayout } from '../SparseArrayLayout.ts'

export class ClearAnimation extends LinearAnimation {
  public static readonly title = 'Clear stored entries'
  public static readonly summary = 'Release stored entries while preserving the logical array length.'

  public static describe(size: number): AlgorithmInformation {
    const information = AnimationSequence.information(this.title, this.summary, size,
      ['O(s)', 'O(s)', 'O(s²)'], 'Iterate only the s stored entries, with expected O(1) deletion per entry. A conservative worst bound permits linear Map maintenance per deletion. Empty storage takes O(1).',
      ['O(1)', 'O(1)', 'O(1)'], 'Only a fixed number of local variables are required.')
    return { ...information, terms: [
        { symbol: 'n', meaning: `Original logical size for this run: n = ${size}.` },
        { symbol: 's', meaning: 'Number of explicitly stored sparse entries; holes consume no entry storage.' },
        { symbol: 'O(1)', meaning: 'Constant work or additional storage.' },
        { symbol: 'O(s)', meaning: 'Linear in the stored-entry count.' },
        { symbol: 'O(s²)', meaning: 'Quadratic in the stored-entry count.' },
    ] }
  }

  constructor(model: LinearModel, input: LinearInputValues = {}) {
    super(model, new SparseArrayLayout(), 'clear', input, ClearAnimation.title, ClearAnimation.summary)
  }
}
