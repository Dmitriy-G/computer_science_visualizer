import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import type { LinearModel, LinearInputValues } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { BRINLayout } from '../BRINLayout.ts'

export class SearchRangeAnimation extends LinearAnimation {
  public static readonly title = 'Search a value range'
  public static readonly summary = 'Prune disjoint page ranges and exactly recheck candidate records.'

  public static describe(size: number): AlgorithmInformation {
    return {
      name: this.title,
      summary: this.summary,
      time: { best: 'O(n)', average: 'O(n)', worst: 'O(n)', explanation: 'Scan min/max summaries and recheck candidate heap records. Worst case all ranges overlap. Returned matching values require O(n) output; working state excluding output is constant. Rows state upper bounds; empty, rejected, and early-return cases may finish sooner.' },
      memory: { best: 'O(n)', average: 'O(n)', worst: 'O(n)', explanation: 'Includes operation working storage and returned output. Playback clones, trace snapshots, and scene storage are excluded. Empty operations can use constant storage.' },
      terms: [
        { symbol: 'n', meaning: `Logical entries before the operation; currently ${size}.` },
        { symbol: 'O(n)', meaning: 'The stated growth bound for this bounded representation.' },
      ],
    }
  }

  constructor(model: LinearModel, input: LinearInputValues = {}) {
    super(model, new BRINLayout(), 'search-overlap', input, SearchRangeAnimation.title, SearchRangeAnimation.summary)
  }
}
