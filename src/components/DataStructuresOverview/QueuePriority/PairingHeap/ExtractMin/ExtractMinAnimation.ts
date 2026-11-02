import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import { AnimationSequence } from '../../../../../visualization/AnimationSequence.ts'
import type { LinearInputValues, LinearModel } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { PairingHeapLayout } from '../PairingHeapLayout.ts'

export class ExtractMinAnimation extends LinearAnimation {
  public static readonly title = 'Extract minimum'
  public static readonly summary = 'Pair adjacent children left-to-right, then combine the resulting heaps right-to-left.'

  public static describe(size: number): AlgorithmInformation {
    const information = AnimationSequence.information(this.title, this.summary, size,
      ['O(1)', 'O(log n)', 'O(n)'], 'The average row denotes O(log n) amortized work across operation sequences, not a random-input expectation. One extraction can process a linear child list. Empty/singleton heaps take O(1).',
      ['O(1)', 'O(n)', 'O(n)'], 'Detached child lists, paired roots, and working-forest arrays retain O(n) references at a time.')
    return { ...information, terms: [
      { symbol: 'n', meaning: `Original logical entry count for this run: n = ${size}.` },
      { symbol: 'O(1)', meaning: 'Constant work or storage.' },
      { symbol: 'O(log n)', meaning: 'Logarithmic in the original entry count.' },
      { symbol: 'O(n)', meaning: 'Linear in the original entry count.' },
    ] }
  }

  constructor(model: LinearModel, input: LinearInputValues = {}) {
    super(model, new PairingHeapLayout(), 'extract-min', input, ExtractMinAnimation.title, ExtractMinAnimation.summary)
  }
}
