import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import { AnimationSequence } from '../../../../../visualization/AnimationSequence.ts'
import type { LinearInputValues, LinearModel } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { FibonacciHeapLayout } from '../FibonacciHeapLayout.ts'

export class MeldAnimation extends LinearAnimation {
  public static readonly title = 'Meld a donor heap'
  public static readonly summary = 'Build a donor, splice root rings, and transfer its stable-handle entries.'

  public static describe(size: number): AlgorithmInformation {
    const information = AnimationSequence.information(this.title, this.summary, size,
      ['O(m)', 'O(m)', 'O(n + m)'], 'Root-ring splicing itself is constant work. Building m donor nodes and transferring their Map entries costs expected amortized O(m); a conservative worst row includes handle-table growth. No consolidation is performed.',
      ['O(m)', 'O(m)', 'O(n + m)'], 'The donor requires m nodes; handle-table growth can allocate storage for all n + m handles.')
    return { ...information, terms: [
      { symbol: 'n', meaning: `Original logical entry count for this run: n = ${size}.` },
      { symbol: 'm', meaning: 'Number of supplied donor values, from 1 to 16. Donor construction is included in the action cost.' },
      { symbol: 'O(m)', meaning: 'Linear in the donor entry count.' },
      { symbol: 'O(n + m)', meaning: 'An upper bound in the original size n and, when present, donor size m; logarithms are treated as at least one for small inputs.' },
    ] }
  }

  constructor(model: LinearModel, input: LinearInputValues = {}) {
    super(model, new FibonacciHeapLayout(), 'meld', input, MeldAnimation.title, MeldAnimation.summary)
  }
}
