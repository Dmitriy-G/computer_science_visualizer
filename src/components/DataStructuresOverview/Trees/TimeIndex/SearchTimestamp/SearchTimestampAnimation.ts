import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import type { LinearModel, LinearInputValues } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { TimeIndexLayout } from '../TimeIndexLayout.ts'

export class SearchTimestampAnimation extends LinearAnimation {
  public static readonly title = 'Find by timestamp'
  public static readonly summary = 'Find the earliest retained offset at or after a requested timestamp.'

  public static describe(size: number): AlgorithmInformation {
    return {
      name: this.title,
      summary: this.summary,
      time: { best: 'O(log(n + 1))', average: 'O(log(n + 1))', worst: 'O(log(n + 1))', explanation: 'Lower-bound the nondecreasing prefix maxima. Skip only prefixes whose maximum is strictly below the query, then scan at most three records, including out-of-order and duplicate timestamps. Rows state upper bounds; empty, rejected, and early-return cases may finish sooner.' },
      memory: { best: 'O(1)', average: 'O(1)', worst: 'O(1)', explanation: 'Includes operation working storage and returned output. Playback clones, trace snapshots, and scene storage are excluded. Empty operations can use constant storage.' },
      terms: [
        { symbol: 'n', meaning: `Logical entries before the operation; currently ${size}.` },
        { symbol: 'O(log(n + 1))', meaning: 'The stated growth bound for this bounded representation.' },
        { symbol: 'O(1)', meaning: 'Additional working and output storage for the operation.' },
      ],
    }
  }

  constructor(model: LinearModel, input: LinearInputValues = {}) {
    super(model, new TimeIndexLayout(), 'search-value', input, SearchTimestampAnimation.title, SearchTimestampAnimation.summary)
  }
}
