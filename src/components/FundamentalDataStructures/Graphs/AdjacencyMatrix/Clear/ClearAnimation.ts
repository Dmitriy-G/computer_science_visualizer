import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import type { LinearModel, LinearInputValues } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { AdjacencyMatrixLayout } from '../AdjacencyMatrixLayout.ts'

export class ClearAnimation extends LinearAnimation {
  public static readonly title = 'Clear'
  public static readonly summary = 'Remove rows and columns until the matrix is empty.'

  public static describe(size: number, edges: number): AlgorithmInformation {
    return {
      name: this.title, summary: this.summary,
      time: { best: 'O(V²)', average: 'O(V²)', worst: 'O(V²)', explanation: 'Clear always removes the last vertex. At size k it scans the last row and column, then removes their final slots without shifting surviving cells. Summing O(k) over V releases gives O(V²) for every matrix. Registry operations assume constant time; empty input takes O(1).' },
      memory: { best: 'O(1)', average: 'O(1)', worst: 'O(1)', explanation: 'Rows and cells are removed in place. Only indices and constant-size splice results are needed; the original matrix, deferred garbage collection, and playback snapshots are excluded.' },
      terms: [
        { symbol: 'V', meaning: `Original vertex count: V = ${size}.` },
        { symbol: 'k', meaning: 'Number of vertices still present during one clear iteration.' },
      ],
    }
  }

  constructor(model: LinearModel, input: LinearInputValues = {}) {
    super(model, new AdjacencyMatrixLayout(), 'clear', input, ClearAnimation.title, ClearAnimation.summary)
  }
}
