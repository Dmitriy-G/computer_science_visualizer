import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import type { LinearModel, LinearInputValues } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { IVFIndexLayout } from '../IVFIndexLayout.ts'

export class NearestNeighborAnimation extends LinearAnimation {
  public static readonly title = 'Nearest neighbor'
  public static readonly summary = 'Probe selected centroid lists and compare their stored vectors.'

  public static describe(size: number): AlgorithmInformation {
    return {
      name: this.title,
      summary: this.summary,
      time: { best: 'O(n)', average: 'O(n)', worst: 'O(n)', explanation: 'Rank at most eight centroids, then scan only selected lists and retain one best match. Worst case all n vectors are visited. Ranking storage is bounded by eight centroids; fewer probes are approximate. Rows state upper bounds; empty, rejected, and early-return cases may finish sooner.' },
      memory: { best: 'O(1)', average: 'O(1)', worst: 'O(1)', explanation: 'Includes operation working storage and returned output. Playback clones, trace snapshots, and scene storage are excluded. Empty operations can use constant storage.' },
      terms: [
        { symbol: 'n', meaning: `Logical entries before the operation; currently ${size}.` },
        { symbol: 'O(n)', meaning: 'The stated growth bound for this bounded representation.' },
        { symbol: 'O(1)', meaning: 'Additional working and output storage for the operation.' },
      ],
    }
  }

  constructor(model: LinearModel, input: LinearInputValues = {}) {
    super(model, new IVFIndexLayout(), 'nearest-neighbor', input, NearestNeighborAnimation.title, NearestNeighborAnimation.summary)
  }
}
