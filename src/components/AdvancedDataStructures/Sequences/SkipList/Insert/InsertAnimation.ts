import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import { AnimationSequence } from '../../../../../visualization/AnimationSequence.ts'
import type { LinearInputValues, LinearModel } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { SkipListLayout } from '../SkipListLayout.ts'

export class InsertAnimation extends LinearAnimation {
  public static readonly title = 'Insert a key'
  public static readonly summary = 'Locate predecessors, reject duplicates, and splice a seeded tower into sorted levels.'

  public static describe(size: number): AlgorithmInformation {
    const information = AnimationSequence.information(this.title, this.summary, size,
      ['O(1)', 'O(n)', 'O(n)'], 'Search moves right and down through six levels. With this fixed height cap, O(n) is a conservative average and worst bound; the usual expected O(log n) skip-list bound assumes a geometric tower policy whose maximum height scales with n. A key before the first entry needs only the fixed six descents.',
      ['O(1)', 'O(1)', 'O(1)'], 'At most six forward links and six saved predecessor references are required.')
    return { ...information, terms: [
        { symbol: 'n', meaning: `Original logical size for this run: n = ${size}.` },
        { symbol: 'O(1)', meaning: 'Constant work or additional storage.' },
        { symbol: 'O(n)', meaning: 'Linear in the original size.' },
    ] }
  }

  constructor(model: LinearModel, input: LinearInputValues = {}) {
    super(model, new SkipListLayout(), 'insert', input, InsertAnimation.title, InsertAnimation.summary)
  }
}
