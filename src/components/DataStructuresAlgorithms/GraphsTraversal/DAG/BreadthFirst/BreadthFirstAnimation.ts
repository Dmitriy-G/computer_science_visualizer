import { DAGPseudocode } from '../DAGPseudocode.ts'
import { GraphAnimation } from '../../../../../visualization/GraphAnimation.ts'
import { GraphSceneLayout } from '../../../../../visualization/GraphSceneLayout.ts'
import type { GraphModel, GraphInputValues } from '../../../../../visualization/GraphModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'

export class BreadthFirstAnimation extends GraphAnimation {
  public static readonly pseudocode = DAGPseudocode.breadthFirst
  public static readonly title = 'Breadth-first traversal'
  public static readonly summary = 'Traverse only vertices reachable from the chosen start using a queue.'

  public static describe(vertices: number, edges = 0): AlgorithmInformation {
    return {
      name: this.title,
      summary: this.summary,
      time: { best: 'O(1)', average: 'O(V + E)', worst: 'O(V + E)', explanation: 'A first, isolated start is constant; otherwise resolving the start by value costs up to V and traversal then scans reachable vertices and edges. Average is a general bound without a probability model.' },
      memory: { best: 'O(1)', average: 'O(V)', worst: 'O(V)', explanation: 'Visited set, queue, and output, bounded by reachable vertices. Animation snapshots and traces are excluded.' },
      terms: [
        { symbol: 'V', meaning: `Number of vertices for this run: V = ${vertices}.` },
        { symbol: 'E', meaning: `Number of edges for this run: E = ${edges}. Parallel edges count separately.` },
        { symbol: 'O', meaning: 'Asymptotic bounds count model operations, assuming expected constant Map/Set access.' },
      ],
    }
  }

  constructor(model: GraphModel, input: GraphInputValues = {}) {
    super(model, new GraphSceneLayout(), 'breadth-first', input, BreadthFirstAnimation.title, BreadthFirstAnimation.summary)
  }
}
