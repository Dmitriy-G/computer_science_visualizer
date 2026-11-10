import { WeightedGraphPseudocode } from '../WeightedGraphPseudocode.ts'
import { GraphAnimation } from '../../../../../visualization/GraphAnimation.ts'
import { GraphSceneLayout } from '../../../../../visualization/GraphSceneLayout.ts'
import type { GraphModel, GraphInputValues } from '../../../../../visualization/GraphModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'

export class ShortestPathAnimation extends GraphAnimation {
  public static readonly pseudocode = WeightedGraphPseudocode.shortestPath
  public static readonly title = 'Dijkstra shortest path'
  public static readonly summary = 'Settle the nearest unsettled vertex and relax nonnegative edges; return distance and path.'

  public static describe(vertices: number, edges = 0): AlgorithmInformation {
    return {
      name: this.title,
      summary: this.summary,
      time: { best: 'O(V)', average: 'O(V^2 + E)', worst: 'O(V^2 + E)', explanation: 'This implementation scans distances for each minimum rather than using a heap. Source equals target still initializes V distances. BigInt keeps path sums exact; bounds count arithmetic operations. Average is a general bound without a probability model.' },
      memory: { best: 'O(V)', average: 'O(V)', worst: 'O(V)', explanation: 'Distances, predecessors, settled vertices, and output path. BigInt digit storage grows with the path sum. Animation snapshots and traces are excluded.' },
      terms: [
        { symbol: 'V', meaning: `Number of vertices for this run: V = ${vertices}.` },
        { symbol: 'E', meaning: `Number of edges for this run: E = ${edges}. Parallel edges count separately.` },
        { symbol: 'O', meaning: 'Asymptotic bounds count model operations, assuming expected constant Map/Set access.' },
      ],
    }
  }

  constructor(model: GraphModel, input: GraphInputValues = {}) {
    super(model, new GraphSceneLayout(), 'shortest-path', input, ShortestPathAnimation.title, ShortestPathAnimation.summary)
  }
}
