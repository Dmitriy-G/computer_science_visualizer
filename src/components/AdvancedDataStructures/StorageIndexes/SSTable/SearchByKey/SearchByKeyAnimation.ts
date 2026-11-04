import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import type { LinearModel, LinearInputValues } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { SSTableLayout } from '../SSTableLayout.ts'

export class SearchByKeyAnimation extends LinearAnimation {
  public static readonly title = 'Look up a key'
  public static readonly summary = 'Locate a key through the stored index and read its value.'

  public static describe(size: number): AlgorithmInformation {
    return {
      name: this.title,
      summary: this.summary,
      time: { best: 'O(log(n + 1))', average: 'O(log(n + 1))', worst: 'O(log(n + 1))', explanation: 'Lower-bound search over block last keys, one simulated data-block read, and binary search in a block of at most three records. A query beyond the final fence reads no data block. Rows state upper bounds; empty, rejected, and early-return cases may finish sooner.' },
      memory: { best: 'O(1)', average: 'O(1)', worst: 'O(1)', explanation: 'Includes operation working storage and returned output. Playback clones, trace snapshots, and scene storage are excluded. Empty operations can use constant storage.' },
      terms: [
        { symbol: 'n', meaning: `Logical entries before the operation; currently ${size}.` },
        { symbol: 'O(log(n + 1))', meaning: 'The stated growth bound for this bounded representation.' },
        { symbol: 'O(1)', meaning: 'Additional working and output storage for the operation.' },
      ],
    }
  }

  constructor(model: LinearModel, input: LinearInputValues = {}) {
    super(model, new SSTableLayout(), 'search-value', input, SearchByKeyAnimation.title, SearchByKeyAnimation.summary)
  }
}
