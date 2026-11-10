import { DAGPseudocode } from '../DAGPseudocode.ts'
import { GraphAnimation } from '../../../../../visualization/GraphAnimation.ts'
import { GraphSceneLayout } from '../../../../../visualization/GraphSceneLayout.ts'
import type { GraphModel, GraphInputValues } from '../../../../../visualization/GraphModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'

export class TopologicalSortAnimation extends GraphAnimation {
  public static readonly pseudocode = DAGPseudocode.topologicalSort
  public static readonly title = 'Topological sort'
  public static readonly summary = 'Use the Kahn algorithm: emit zero-indegree vertices and release their outgoing dependencies.'

  public static describe(vertices: number, edges = 0): AlgorithmInformation {
    return {
      name: this.title,
      summary: this.summary,
      time: { best: 'O(V + E)', average: 'O(V + E)', worst: 'O(V + E)', explanation: 'Initialize indegrees, queue every ready vertex, and inspect each edge once. Any valid topological order is acceptable. Average is a general bound without a probability model.' },
      memory: { best: 'O(V)', average: 'O(V)', worst: 'O(V)', explanation: 'Indegrees, ready queue, and output ordering. Animation snapshots and traces are excluded.' },
      terms: [
        { symbol: 'V', meaning: `Number of vertices for this run: V = ${vertices}.` },
        { symbol: 'E', meaning: `Number of edges for this run: E = ${edges}. Parallel edges count separately.` },
        { symbol: 'O', meaning: 'Asymptotic bounds count model operations, assuming expected constant Map/Set access.' },
      ],
    }
  }

  constructor(model: GraphModel, input: GraphInputValues = {}) {
    super(model, new GraphSceneLayout(), 'topological-sort', input, TopologicalSortAnimation.title, TopologicalSortAnimation.summary)
  }
}
