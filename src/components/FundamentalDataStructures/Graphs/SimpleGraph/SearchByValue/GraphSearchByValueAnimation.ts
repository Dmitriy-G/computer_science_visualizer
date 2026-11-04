import { GraphAnimation } from '../../../../../visualization/GraphAnimation.ts'
import { GraphSceneLayout } from '../../../../../visualization/GraphSceneLayout.ts'
import type { GraphModel, GraphInputValues } from '../../../../../visualization/GraphModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'

export class GraphSearchByValueAnimation extends GraphAnimation {
  public static readonly title = 'Search by value'
  public static readonly summary = 'Use BFS and restart at each unvisited component until a value matches.'

  public static describe(vertices: number, edges = 0): AlgorithmInformation {
    return {
      name: this.title,
      summary: this.summary,
      time: { best: 'O(1)', average: 'O(V + E)', worst: 'O(V + E)', explanation: 'The first vertex can match; an absent value visits every vertex and inspects every adjacency. Average is a general bound without a probability model.' },
      memory: { best: 'O(1)', average: 'O(V)', worst: 'O(V)', explanation: 'Visited set, queue, and returned traversal IDs. Animation snapshots and traces are excluded.' },
      terms: [
        { symbol: 'V', meaning: `Number of vertices for this run: V = ${vertices}.` },
        { symbol: 'E', meaning: `Number of edges for this run: E = ${edges}. Parallel edges count separately.` },
        { symbol: 'O', meaning: 'Asymptotic bounds count model operations, assuming expected constant Map/Set access.' },
      ],
    }
  }

  constructor(model: GraphModel, input: GraphInputValues = {}) {
    super(model, new GraphSceneLayout(), 'search-value', input, GraphSearchByValueAnimation.title, GraphSearchByValueAnimation.summary)
  }
}
