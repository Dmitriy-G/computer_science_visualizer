import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import type { LinearModel, LinearInputValues } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { HNSWGraphLayout } from '../HNSWGraphLayout.ts'

export class SearchByValueAnimation extends LinearAnimation {
  public static readonly title = 'Find a vector ID'
  public static readonly summary = 'Look up the coordinates and level of a stored vector.'

  public static describe(size: number): AlgorithmInformation {
    return {
      name: this.title,
      summary: this.summary,
      time: { best: 'O(1)', average: 'O(1)', worst: 'O(n)', explanation: 'Expected constant-time Map lookup, with a linear worst-case collision bound, retrieves a vector ID; this is separate from approximate geometric search. Rows are upper bounds for this teaching variant; empty or early-return cases can finish sooner.' },
      memory: { best: 'O(1)', average: 'O(1)', worst: 'O(1)', explanation: 'Includes working collections and output required by this operation. Playback clones, recorded trace frames, and scene snapshots are excluded.' },
      terms: [
        { symbol: 'n', meaning: `Logical entries before this operation; currently ${size}.` },
        { symbol: 'O(1)', meaning: 'A fixed amount of work or storage under the stated universe, word, and capacity bounds.' },
        { symbol: 'O(n)', meaning: 'Linear work or storage in the logical entry count.' },
      ],
    }
  }

  constructor(model: LinearModel, input: LinearInputValues = { value: 1 }) {
    super(model, new HNSWGraphLayout(), 'search-value', input, SearchByValueAnimation.title, SearchByValueAnimation.summary)
  }
}
