import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import type { LinearModel, LinearInputValues } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { BipartiteGraphLayout } from '../BipartiteGraphLayout.ts'

export class AddVertexAnimation extends LinearAnimation {
  public static readonly title = 'Add a partitioned vertex'
  public static readonly summary = 'Place a new vertex explicitly in partition L (0) or R (1).'

  public static describe(size: number, edges: number): AlgorithmInformation {
    return {
      name: this.title, summary: this.summary,
      time: { best: 'O(1)', average: 'O(1)', worst: 'O(V)', explanation: 'Append one vertex record with its partition and update the vertex registries; no existing edges are scanned or copied. Average denotes expected amortized cost with constant-time Map access and amortized host-array append. A backing-array or registry growth can take O(V).' },
      memory: { best: 'O(1)', average: 'O(1)', worst: 'O(V)', explanation: 'Without growth, the new vertex and metadata need constant storage. Average allocation is amortized over insertions; one backing-array or registry growth may allocate O(V). Existing edge storage and playback are excluded.' },
      terms: [
        { symbol: 'V', meaning: `Original vertex count: V = ${size}.` },
      ],
    }
  }

  constructor(model: LinearModel, input: LinearInputValues = {}) {
    super(model, new BipartiteGraphLayout(), 'add-vertex', input, AddVertexAnimation.title, AddVertexAnimation.summary)
  }
}
