import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import { AnimationSequence } from '../../../../../visualization/AnimationSequence.ts'
import type { LinearInputValues, LinearModel } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { IndexedPriorityQueueLayout } from '../IndexedPriorityQueueLayout.ts'

export class ExtractMinAnimation extends LinearAnimation {
  public static readonly title = 'Extract minimum'
  public static readonly summary = 'Remove the minimum key, repair the heap, and remove its inverse mapping.'

  public static describe(size: number): AlgorithmInformation {
    const information = AnimationSequence.information(this.title, this.summary, size,
      ['O(1)', 'O(log n)', 'O(n log n)'], 'The inverse key-to-position Map avoids a linear search. Heap sifting follows at most the complete-tree height. Bounds assume expected constant Map access; the conservative linear worst row also allows table maintenance. Missing or duplicate keys return without mutation. The conservative worst row allows linear Map work per exchange.',
      ['O(1)', 'O(1)', 'O(1)'], 'Only a fixed number of local references and indices are needed.')
    return { ...information, terms: [
      { symbol: 'n', meaning: `Original logical entry count for this run: n = ${size}.` },
      { symbol: 'O(1)', meaning: 'Constant work or storage.' },
      { symbol: 'O(log n)', meaning: 'Logarithmic in the original entry count.' },
      { symbol: 'O(n log n)', meaning: 'An upper bound in the original size n and, when present, donor size m; logarithms are treated as at least one for small inputs.' },
    ] }
  }

  constructor(model: LinearModel, input: LinearInputValues = {}) {
    super(model, new IndexedPriorityQueueLayout(), 'extract-min', input, ExtractMinAnimation.title, ExtractMinAnimation.summary)
  }
}
