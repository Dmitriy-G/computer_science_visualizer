import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import type { LinearModel, LinearInputValues } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { AdjacencyMatrixLayout } from '../AdjacencyMatrixLayout.ts'

export class AddVertexAnimation extends LinearAnimation {
  public static readonly title = 'Add vertex / matrix row'
  public static readonly summary = 'Add one row and one column of zero cells.'

  public static describe(size: number, edges: number): AlgorithmInformation {
    return {
      name: this.title, summary: this.summary,
      time: { best: 'O(V)', average: 'O(V)', worst: 'O(V²)', explanation: 'The new row and one cell per old row require O(V) amortized work and new cells. A conservative worst row includes managed backing-array copies across rows. Empty insertion takes O(1).' },
      memory: { best: 'O(V)', average: 'O(V)', worst: 'O(V²)', explanation: 'Additional storage includes newly allocated records, packed-array replacements, temporary filters, recursive frames, and any returned traversal order where relevant. Original graph storage, playback clones, and scene snapshots are excluded.' },
      terms: [
        { symbol: 'V', meaning: `Original vertex count: V = ${size}.` },
        { symbol: 'E', meaning: `Original stored edge count: E = ${edges}.` },
      ],
    }
  }

  constructor(model: LinearModel, input: LinearInputValues = {}) {
    super(model, new AdjacencyMatrixLayout(), 'add-vertex', input, AddVertexAnimation.title, AddVertexAnimation.summary)
  }
}
