import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import type { LinearModel, LinearInputValues } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { LSHIndexLayout } from '../LSHIndexLayout.ts'

export class NearestNeighborAnimation extends LinearAnimation {
  public static readonly title = 'Nearest neighbor'
  public static readonly summary = 'Compare the query with stored vectors and report the selected match.'

  public static describe(size: number): AlgorithmInformation {
    return {
      name: this.title,
      summary: this.summary,
      time: { best: 'O(n)', average: 'O(n)', worst: 'O(n)', explanation: 'Compare the query code with every stored eight-bit signature using Hamming distance. Ties use insertion order. The result approximates angular similarity and is not an exact Euclidean nearest neighbor. Rows are upper bounds for this teaching variant; empty or early-return cases can finish sooner.' },
      memory: { best: 'O(1)', average: 'O(1)', worst: 'O(1)', explanation: 'Includes working collections and output required by this operation. Playback clones, recorded trace frames, and scene snapshots are excluded.' },
      terms: [
        { symbol: 'n', meaning: `Logical entries before the operation; currently ${size}.` },
        { symbol: 'O(n)', meaning: 'Linear work or storage in the logical entry count.' },
        { symbol: 'O(1)', meaning: 'Constant work or storage under the stated fixed word, universe, or capacity bounds.' },
      ],
    }
  }

  constructor(model: LinearModel, input: LinearInputValues = { x: 10, y: 10 }) {
    super(model, new LSHIndexLayout(), 'nearest-neighbor', input, NearestNeighborAnimation.title, NearestNeighborAnimation.summary)
  }
}
