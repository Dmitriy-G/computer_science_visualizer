import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import { AnimationSequence } from '../../../../../visualization/AnimationSequence.ts'
import type { LinearInputValues, LinearModel } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { LeftistHeapLayout } from '../LeftistHeapLayout.ts'

export class MeldAnimation extends LinearAnimation {
  public static readonly title = 'Meld a donor heap'
  public static readonly summary = 'Build a donor and recursively meld its root with the current heap.'

  public static describe(size: number): AlgorithmInformation {
    const information = AnimationSequence.information(this.title, this.summary, size,
      ['O(m)', 'O(m log m + log(n + m))', 'O(m log m + log(n + m))'], 'Leftist ranks bound the traversed right spines logarithmically; swaps restore rank(left) >= rank(right). The action also includes constructing m donor nodes. The skew worst row is a conservative bound including donor construction; logarithms are treated as at least one for small sizes.',
      ['O(m + log(n + m))', 'O(m + log(n + m))', 'O(m + log(n + m))'], 'Store m donor nodes and the merge recursion stack.')
    return { ...information, terms: [
      { symbol: 'n', meaning: `Original logical entry count for this run: n = ${size}.` },
      { symbol: 'm', meaning: 'Number of supplied donor values, from 1 to 16. Donor construction is included in the action cost.' },
      { symbol: 'O(m + log(n + m))', meaning: 'An upper bound in the original size n and, when present, donor size m; logarithms are treated as at least one for small inputs.' },
      { symbol: 'O(m log m + log(n + m))', meaning: 'An upper bound in the original size n and, when present, donor size m; logarithms are treated as at least one for small inputs.' },
      { symbol: 'O(m)', meaning: 'Linear in the donor entry count.' },
    ] }
  }

  constructor(model: LinearModel, input: LinearInputValues = {}) {
    super(model, new LeftistHeapLayout(), 'meld', input, MeldAnimation.title, MeldAnimation.summary)
  }
}
