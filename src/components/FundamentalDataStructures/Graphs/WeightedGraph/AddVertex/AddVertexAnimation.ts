import { GraphAnimation } from '../../../../../visualization/GraphAnimation.ts'
import { GraphSceneLayout } from '../../../../../visualization/GraphSceneLayout.ts'
import type { GraphModel, GraphInputValues } from '../../../../../visualization/GraphModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'

export class AddVertexAnimation extends GraphAnimation {
  public static readonly title = 'Add vertex'
  public static readonly summary = 'Check value uniqueness, then create an isolated vertex.'

  public static describe(vertices: number, edges = 0): AlgorithmInformation {
    return {
      name: this.title,
      summary: this.summary,
      time: { best: 'O(1)', average: 'O(V)', worst: 'O(V)', explanation: 'A duplicate may match immediately; otherwise scan vertex values before allocation. Average is a general bound without a probability model.' },
      memory: { best: 'O(1)', average: 'O(1)', worst: 'O(1)', explanation: 'A new vertex and a few references. Animation snapshots and traces are excluded.' },
      terms: [
        { symbol: 'V', meaning: `Number of vertices for this run: V = ${vertices}.` },
        { symbol: 'E', meaning: `Number of edges for this run: E = ${edges}. Parallel edges count separately.` },
        { symbol: 'O', meaning: 'Asymptotic bounds count model operations, assuming expected constant Map/Set access.' },
      ],
    }
  }

  constructor(model: GraphModel, input: GraphInputValues = {}) {
    super(model, new GraphSceneLayout(), 'add-vertex', input, AddVertexAnimation.title, AddVertexAnimation.summary)
  }
}
