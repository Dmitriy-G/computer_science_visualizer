import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import type { LinearModel, LinearInputValues } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { BKDTreeLayout } from '../BKDTreeLayout.ts'

export class SearchRangeAnimation extends LinearAnimation {
  public static readonly title = 'Search a point range'
  public static readonly summary = 'Prune disjoint BKD cells and recheck leaf points.'

  public static describe(size: number): AlgorithmInformation {
    return {
      name: this.title,
      summary: this.summary,
      time: { best: 'O(n)', average: 'O(n)', worst: 'O(n)', explanation: 'A query can visit all nodes and return all points. Balanced recursion uses logarithmic stack space, while output can require linear space. Rows are upper bounds for this teaching variant; empty or early-return cases can finish sooner.' },
      memory: { best: 'O(n)', average: 'O(n)', worst: 'O(n)', explanation: 'Includes working collections and output required by this operation. Playback clones, recorded trace frames, and scene snapshots are excluded.' },
      terms: [
        { symbol: 'n', meaning: `Logical entries before the operation; currently ${size}.` },
        { symbol: 'O(n)', meaning: 'Linear work or storage in the logical entry count.' },
      ],
    }
  }

  constructor(model: LinearModel, input: LinearInputValues = { minX: 0, minY: 0, maxX: 30, maxY: 30 }) {
    super(model, new BKDTreeLayout(), 'search-overlap', input, SearchRangeAnimation.title, SearchRangeAnimation.summary)
  }
}
