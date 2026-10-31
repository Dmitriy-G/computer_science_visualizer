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
      time: { best: 'O(1)', average: 'O(V + E)', worst: 'O(V + E)', explanation: 'Endpoint lookup scans vertex values. Simple graphs check adjacency; DAGs also search for a reverse path to reject cycles. Average is a general bound without a probability model.' },
      memory: { best: 'O(1)', average: 'O(V)', worst: 'O(V)', explanation: 'DAG reachability needs a visited set and frontier; other variants need constant auxiliary space. A new edge is constant storage. Animation snapshots and traces are excluded.' },
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
