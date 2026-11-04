import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import type { LinearModel, LinearInputValues } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { HNSWGraphLayout } from '../HNSWGraphLayout.ts'

export class InsertAnimation extends LinearAnimation {
  public static readonly title = 'Insert a vector'
  public static readonly summary = 'Descend layers, search candidate beams, and publish bounded links.'

  public static describe(size: number): AlgorithmInformation {
    return {
      name: this.title,
      summary: this.summary,
      time: { best: 'O(n² log(n + 1))', average: 'O(n² log(n + 1))', worst: 'O(n² log(n + 1))', explanation: 'Sorted-array candidates may retain O(n) vertices; repeated sorting and beam expansions give this conservative polynomial upper bound, not a logarithmic production guarantee. Maximum degree, beam width, and levels are fixed. Rows are upper bounds for this teaching variant; empty or early-return cases can finish sooner.' },
      memory: { best: 'O(n)', average: 'O(n)', worst: 'O(n)', explanation: 'Includes working collections and output required by this operation. Playback clones, recorded trace frames, and scene snapshots are excluded.' },
      terms: [
        { symbol: 'n', meaning: `Logical entries before the operation; currently ${size}.` },
        { symbol: 'O(n² log(n + 1))', meaning: 'A conservative bound for repeated sorting of candidate collections during graph search.' },
        { symbol: 'O(n)', meaning: 'Linear work or storage in the logical entry count.' },
      ],
    }
  }

  constructor(model: LinearModel, input: LinearInputValues = { x: 10, y: 10 }) {
    super(model, new HNSWGraphLayout(), 'insert', input, InsertAnimation.title, InsertAnimation.summary)
  }
}
