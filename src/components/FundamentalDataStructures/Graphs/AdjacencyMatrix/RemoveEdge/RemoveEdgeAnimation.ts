import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import type { LinearModel, LinearInputValues } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { AdjacencyMatrixLayout } from '../AdjacencyMatrixLayout.ts'

export class RemoveEdgeAnimation extends LinearAnimation {
  public static readonly title = 'Remove edge by ID'
  public static readonly summary = 'Scan for the stable edge ID and zero its matrix cell.'

  public static describe(size: number, edges: number): AlgorithmInformation {
    return {
      name: this.title, summary: this.summary,
      time: { best: 'O(V²)', average: 'O(V²)', worst: 'O(V²)', explanation: 'The stable-ID lookup first materializes all E edge records by scanning the V-by-V matrix, even for a missing ID. Successful deletion scans the cells again to clear the match. No input-distribution assumption is needed.' },
      memory: { best: 'O(E + 1)', average: 'O(E + 1)', worst: 'O(E + 1)', explanation: 'The preliminary getEdges lookup copies all E edge records before searching by ID. Clearing the matching cell itself uses constant storage. Playback snapshots and original matrix storage are excluded.' },
      terms: [
        { symbol: 'V', meaning: `Original vertex count: V = ${size}.` },
        { symbol: 'E', meaning: `Original stored edge count: E = ${edges}.` },
      ],
    }
  }

  constructor(model: LinearModel, input: LinearInputValues = {}) {
    super(model, new AdjacencyMatrixLayout(), 'remove-edge', input, RemoveEdgeAnimation.title, RemoveEdgeAnimation.summary)
  }
}
