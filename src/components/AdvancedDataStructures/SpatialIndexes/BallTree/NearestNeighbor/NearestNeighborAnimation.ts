import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import type { LinearModel, LinearInputValues } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { BallTreeLayout } from '../BallTreeLayout.ts'

export class NearestNeighborAnimation extends LinearAnimation {
  public static readonly title = 'Nearest neighbor'
  public static readonly summary = 'Compare the query with stored vectors and report the selected match.'

  public static describe(size: number): AlgorithmInformation {
    return {
      name: this.title,
      summary: this.summary,
      time: { best: 'O(n)', average: 'O(n)', worst: 'O(n)', explanation: 'The triangle-inequality lower bound prunes balls, but a worst-case query scans all points. The balanced recursion stack is logarithmic. Bounds are upper bounds for every distribution, with stable-ID ties. Rows are upper bounds for this teaching variant; empty or early-return cases can finish sooner.' },
      memory: { best: 'O(log(n + 1))', average: 'O(log(n + 1))', worst: 'O(log(n + 1))', explanation: 'Includes working collections and output required by this operation. Playback clones, recorded trace frames, and scene snapshots are excluded.' },
      terms: [
        { symbol: 'n', meaning: `Logical entries before the operation; currently ${size}.` },
        { symbol: 'O(n)', meaning: 'Linear work or storage in the logical entry count.' },
        { symbol: 'O(log(n + 1))', meaning: 'Logarithmic growth in entry count, with empty and singleton boundaries handled separately.' },
      ],
    }
  }

  constructor(model: LinearModel, input: LinearInputValues = { x: 10, y: 10 }) {
    super(model, new BallTreeLayout(), 'nearest-neighbor', input, NearestNeighborAnimation.title, NearestNeighborAnimation.summary)
  }
}
