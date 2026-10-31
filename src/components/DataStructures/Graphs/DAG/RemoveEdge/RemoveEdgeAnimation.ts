import { GraphAnimation } from '../../../../../visualization/GraphAnimation.ts'
import { GraphSceneLayout } from '../../../../../visualization/GraphSceneLayout.ts'
import type { GraphModel, GraphInputValues } from '../../../../../visualization/GraphModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'

export class RemoveEdgeAnimation extends GraphAnimation {
  public static readonly title = 'Remove edge'
  public static readonly summary = 'Remove the selected edge ID, preserving every other edge.'

  public static describe(vertices: number, edges = 0): AlgorithmInformation {
    return {
      name: this.title,
      summary: this.summary,
      time: { best: 'O(1)', average: 'O(1)', worst: 'O(1)', explanation: 'An edge-ID map and endpoint adjacency sets allow direct removal; assumes expected constant Map/Set access. Average is a general bound without a probability model.' },
      memory: { best: 'O(1)', average: 'O(1)', worst: 'O(1)', explanation: 'A few references; no traversal buffer. Animation snapshots and traces are excluded.' },
      terms: [
        { symbol: 'V', meaning: `Number of vertices for this run: V = ${vertices}.` },
        { symbol: 'E', meaning: `Number of edges for this run: E = ${edges}. Parallel edges count separately.` },
        { symbol: 'O', meaning: 'Asymptotic bounds count model operations, assuming expected constant Map/Set access.' },
      ],
    }
  }

  constructor(model: GraphModel, input: GraphInputValues = {}) {
    super(model, new GraphSceneLayout(), 'remove-edge', input, RemoveEdgeAnimation.title, RemoveEdgeAnimation.summary)
  }
}
