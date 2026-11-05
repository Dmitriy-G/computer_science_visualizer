import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import { AnimationSequence } from '../../../../../visualization/AnimationSequence.ts'
import type { LinearInputValues, LinearModel } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { BinomialHeapLayout } from '../BinomialHeapLayout.ts'

export class MeldAnimation extends LinearAnimation {
  public static readonly title = 'Meld a donor heap'
  public static readonly summary = 'Build a donor from the supplied values and merge the forests by degree.'

  public static describe(size: number): AlgorithmInformation {
    const information = AnimationSequence.information(this.title, this.summary, size,
      ['O(m log m + log(n + m))', 'O(m log m + log(n + m))', 'O(m log m + log(n + m))'], 'Each donor insertion scans its degree table, so constructing m donor values costs O(m log m) in every key order. Final consolidation scans through the maximum degree in O(log(n + m)). The displayed action includes both. Treat logarithms as at least one for small inputs.',
      ['O(m + log(n + m))', 'O(m + log(n + m))', 'O(m + log(n + m))'], 'Allocate m donor nodes and logarithmic temporary root lists.')
    return { ...information, terms: [
      { symbol: 'n', meaning: `Original logical entry count for this run: n = ${size}.` },
      { symbol: 'm', meaning: 'Number of supplied donor values, from 1 to 16. Donor construction is included in the action cost.' },
      { symbol: 'O(m + log(n + m))', meaning: 'An upper bound in the original size n and, when present, donor size m; logarithms are treated as at least one for small inputs.' },
      { symbol: 'O(m log m + log(n + m))', meaning: 'An upper bound in the original size n and, when present, donor size m; logarithms are treated as at least one for small inputs.' },
      { symbol: 'O(m)', meaning: 'Linear in the donor entry count.' },
    ] }
  }

  constructor(model: LinearModel, input: LinearInputValues = {}) {
    super(model, new BinomialHeapLayout(), 'meld', input, MeldAnimation.title, MeldAnimation.summary)
  }
}
