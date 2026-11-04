import { ArraySortingAnimation } from '../ArraySortingAnimation.ts'
import { FixedArray } from '../../../../FundamentalDataStructures/Linear/Array/FixedArray.ts'

export class TournamentSortAnimation extends ArraySortingAnimation {
  public static describe(size: number) {
    return this.information('Tournament Sort', 'Build a winner tree, repeatedly output its minimum, and replay only the winning leaf’s ancestor matches.', size,
      ['O(n log n)', 'O(n log n)', 'O(n log n)'],
      'Build the padded winner tree in O(n), then replay a logarithmic ancestor path for each of n winners regardless of input order. All time cases are O(n log n); average assumes random distinct permutations. Empty and singleton inputs take O(1).',
      'O(n)', 'The complete winner tree and merged output require O(n) slots. Exhausted leaves use an explicit empty marker, allowing all safe-integer keys. Ties use original array positions, so this variant is stable.')
  }

  constructor(model: FixedArray) {
    super(model, 'Tournament Sort', { distribution: true })
    this.result.tournamentSort((event) => this.recordTrace(event))
    this.finish(true)
    this.fitScenes()
  }
}
