import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import type { LinearModel, LinearInputValues } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { AdjacencyMatrixLayout } from '../AdjacencyMatrixLayout.ts'

export class DeleteByValueAnimation extends LinearAnimation {
  public static readonly title = 'Delete vertex / row / column'
  public static readonly summary = 'Remove its row and column, shifting matrix indices but preserving IDs.'

  public static describe(size: number, edges: number): AlgorithmInformation {
    return {
      name: this.title, summary: this.summary,
      time: { best: 'O(V)', average: 'O(V²)', worst: 'O(V²)', explanation: 'A miss scans V vertex values; deleting the last vertex scans its row and column without shifting cells. Removing an early column shifts up to V cells in each of V rows. Average O(V²) assumes a uniformly chosen existing vertex. Registry operations assume constant time.' },
      memory: { best: 'O(1)', average: 'O(1)', worst: 'O(1)', explanation: 'Splice removes one row reference and one cell per surviving row in place; it does not allocate a replacement matrix. Temporary splice results have constant size. Existing storage, deferred collection, and playback are excluded.' },
      terms: [
        { symbol: 'V', meaning: `Original vertex count: V = ${size}.` },
      ],
    }
  }

  constructor(model: LinearModel, input: LinearInputValues = {}) {
    super(model, new AdjacencyMatrixLayout(), 'delete-value', input, DeleteByValueAnimation.title, DeleteByValueAnimation.summary)
  }
}
