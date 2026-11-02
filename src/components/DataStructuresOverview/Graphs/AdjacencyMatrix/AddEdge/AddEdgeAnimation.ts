import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import type { LinearModel, LinearInputValues } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { AdjacencyMatrixLayout } from '../AdjacencyMatrixLayout.ts'

export class AddEdgeAnimation extends LinearAnimation {
  public static readonly title = 'Set a matrix cell'
  public static readonly summary = 'Store a directed edge by writing its source-row / target-column cell.'

  public static describe(size: number, edges: number): AlgorithmInformation {
    return {
      name: this.title, summary: this.summary,
      time: { best: 'O(1)', average: 'O(1)', worst: 'O(1)', explanation: 'Cached vertex positions and edge count allow direct duplicate checking and a single-cell write. Bounds assume expected constant Map lookup; pathological table behavior is not represented as constant worst-case hashing.' },
      memory: { best: 'O(1)', average: 'O(1)', worst: 'O(1)', explanation: 'Additional storage includes newly allocated records, packed-array replacements, temporary filters, recursive frames, and any returned traversal order where relevant. Original graph storage, playback clones, and scene snapshots are excluded.' },
      terms: [
        { symbol: 'V', meaning: `Original vertex count: V = ${size}.` },
        { symbol: 'E', meaning: `Original stored edge count: E = ${edges}.` },
      ],
    }
  }

  constructor(model: LinearModel, input: LinearInputValues = {}) {
    super(model, new AdjacencyMatrixLayout(), 'add-edge', input, AddEdgeAnimation.title, AddEdgeAnimation.summary)
  }
}
