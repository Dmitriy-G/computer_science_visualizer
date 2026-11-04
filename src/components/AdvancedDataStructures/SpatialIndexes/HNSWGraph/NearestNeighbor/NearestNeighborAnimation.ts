import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import type { LinearModel, LinearInputValues } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { HNSWGraphLayout } from '../HNSWGraphLayout.ts'

export class NearestNeighborAnimation extends LinearAnimation {
  public static readonly title = 'Nearest neighbor'
  public static readonly summary = 'Compare the query with stored vectors and report the selected match.'

  public static describe(size: number): AlgorithmInformation {
    return {
      name: this.title,
      summary: this.summary,
      time: { best: 'O(n² log(n + 1))', average: 'O(n² log(n + 1))', worst: 'O(n² log(n + 1))', explanation: 'Greedy upper-layer descent and the layer-zero beam explore stored links. Candidate arrays are repeatedly sorted. This conservative bound describes the teaching implementation; approximate search can miss the global nearest point. Rows are upper bounds for this teaching variant; empty or early-return cases can finish sooner.' },
      memory: { best: 'O(n)', average: 'O(n)', worst: 'O(n)', explanation: 'Includes working collections and output required by this operation. Playback clones, recorded trace frames, and scene snapshots are excluded.' },
      terms: [
        { symbol: 'n', meaning: `Logical entries before the operation; currently ${size}.` },
        { symbol: 'O(n² log(n + 1))', meaning: 'A conservative bound for repeated sorting of candidate collections during graph search.' },
        { symbol: 'O(n)', meaning: 'Linear work or storage in the logical entry count.' },
      ],
    }
  }

  constructor(model: LinearModel, input: LinearInputValues = { x: 10, y: 10 }) {
    super(model, new HNSWGraphLayout(), 'nearest-neighbor', input, NearestNeighborAnimation.title, NearestNeighborAnimation.summary)
  }
}
