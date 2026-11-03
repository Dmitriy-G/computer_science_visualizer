import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import type { LinearModel, LinearInputValues } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { GiSTLayout } from '../GiSTLayout.ts'

export class SearchOverlapAnimation extends LinearAnimation {
  public static readonly title = 'Search overlapping intervals'
  public static readonly summary = 'Prune inconsistent union bounds and recheck leaf intervals.'

  public static describe(size: number): AlgorithmInformation {
    return {
      name: this.title,
      summary: this.summary,
      time: { best: 'O(n)', average: 'O(n)', worst: 'O(n)', explanation: 'Overlapping union bounds can force every page and record to be examined. Output can contain all records; these are conservative upper bounds. Rows are upper bounds for this teaching variant; empty or early-return cases can finish sooner.' },
      memory: { best: 'O(n)', average: 'O(n)', worst: 'O(n)', explanation: 'Includes working collections and output required by this operation. Playback clones, recorded trace frames, and scene snapshots are excluded.' },
      terms: [
        { symbol: 'n', meaning: `Logical entries before the operation; currently ${size}.` },
        { symbol: 'O(n)', meaning: 'Linear work or storage in the logical entry count.' },
      ],
    }
  }

  constructor(model: LinearModel, input: LinearInputValues = { minimum: 10, maximum: 30 }) {
    super(model, new GiSTLayout(), 'search-overlap', input, SearchOverlapAnimation.title, SearchOverlapAnimation.summary)
  }
}
