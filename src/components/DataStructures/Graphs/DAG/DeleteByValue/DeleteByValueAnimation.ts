import { GraphAnimation } from '../../../../../visualization/GraphAnimation.ts'
import { GraphSceneLayout } from '../../../../../visualization/GraphSceneLayout.ts'
import type { GraphModel, GraphInputValues } from '../../../../../visualization/GraphModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'

export class DeleteByValueAnimation extends GraphAnimation {
  public static readonly title = 'Delete vertex'
  public static readonly summary = 'Search by value, detach incident edges, then release the vertex.'

  public static describe(vertices: number, edges = 0): AlgorithmInformation {
    return {
      name: this.title,
      summary: this.summary,
      time: { best: 'O(E + 1)', average: 'O(V + E)', worst: 'O(V + E)', explanation: 'A missing value searches the graph. Removing a found vertex scans all edges for incoming and outgoing incidences; early matches can still save search work. Average is a general bound without a probability model.' },
      memory: { best: 'O(1)', average: 'O(V)', worst: 'O(V)', explanation: 'BFS visited set and frontier; edge removal needs no extra collection. Animation snapshots and traces are excluded.' },
      terms: [
        { symbol: 'V', meaning: `Number of vertices for this run: V = ${vertices}.` },
        { symbol: 'E', meaning: `Number of edges for this run: E = ${edges}. Parallel edges count separately.` },
        { symbol: 'O', meaning: 'Asymptotic bounds count model operations, assuming expected constant Map/Set access.' },
      ],
    }
  }

  constructor(model: GraphModel, input: GraphInputValues = {}) {
    super(model, new GraphSceneLayout(), 'delete-value', input, DeleteByValueAnimation.title, DeleteByValueAnimation.summary)
  }
}
