import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import { AnimationSequence } from '../../../../../visualization/AnimationSequence.ts'
import type { LinearInputValues, LinearModel } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { GapBufferLayout } from '../GapBufferLayout.ts'

export class SearchAnimation extends LinearAnimation {
  public static readonly title = 'Search for text'
  public static readonly summary = 'Compare candidate text spans using logical indices that skip the gap.'

  public static describe(size: number): AlgorithmInformation {
    const information = AnimationSequence.information(this.title, this.summary, size,
      ['O(m)', 'O(nm)', 'O(nm)'], 'A first-position match takes m comparisons. O(nm) is a conservative upper bound for average and worst work without a distribution assumption; repeated prefixes can require m checks per candidate. A pattern longer than the text is rejected in O(1).',
      ['O(1)', 'O(1)', 'O(1)'], 'Only a fixed number of local variables are required.')
    return { ...information, terms: [
        { symbol: 'n', meaning: `Original logical size for this run: n = ${size}.` },
        { symbol: 'm', meaning: 'Number of characters supplied for insertion or search; each request allows 1 to 32 ASCII characters.' },
        { symbol: 'O(1)', meaning: 'Constant work or additional storage.' },
        { symbol: 'O(m)', meaning: 'Linear in the supplied text length.' },
        { symbol: 'O(nm)', meaning: 'At most the product of original and search text lengths.' },
    ] }
  }

  constructor(model: LinearModel, input: LinearInputValues = {}) {
    super(model, new GapBufferLayout(), 'search-value', input, SearchAnimation.title, SearchAnimation.summary)
  }
}
