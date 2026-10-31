import { GraphAnimation } from '../../../../../visualization/GraphAnimation.ts'
import { GraphSceneLayout } from '../../../../../visualization/GraphSceneLayout.ts'
import type { GraphModel, GraphInputValues } from '../../../../../visualization/GraphModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'

export class AddEdgeAnimation extends GraphAnimation {
  public static readonly title = 'Add edge'
  public static readonly summary = 'Resolve existing endpoints and connect an edge according to its edge rules.'

  public static describe(vertices: number, edges = 0): AlgorithmInformation {
    return {
      name: this.title,
      summary: this.summary,
      time: { best: 'O(1)', average: 'O(V + E)', worst: 'O(V + E)', explanation: 'Resolve endpoint values and inspect the source adjacency for an existing edge. Early matches can finish immediately; a full scan costs O(V + E). Average is a general bound without a probability model.' },
      memory: { best: 'O(1)', average: 'O(1)', worst: 'O(1)', explanation: 'Endpoint references and one new edge; duplicate checking iterates adjacency without copying it. Animation snapshots and traces are excluded.' },
      terms: [
        { symbol: 'V', meaning: `Number of vertices for this run: V = ${vertices}.` },
        { symbol: 'E', meaning: `Number of edges for this run: E = ${edges}. Parallel edges count separately.` },
        { symbol: 'O', meaning: 'Asymptotic bounds count model operations, assuming expected constant Map/Set access.' },
      ],
    }
  }

  constructor(model: GraphModel, input: GraphInputValues = {}) {
    super(model, new GraphSceneLayout(), 'add-edge', input, AddEdgeAnimation.title, AddEdgeAnimation.summary)
  }
}
