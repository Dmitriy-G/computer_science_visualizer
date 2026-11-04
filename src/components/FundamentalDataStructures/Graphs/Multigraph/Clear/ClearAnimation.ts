import { GraphAnimation } from '../../../../../visualization/GraphAnimation.ts'
import { GraphSceneLayout } from '../../../../../visualization/GraphSceneLayout.ts'
import type { GraphModel, GraphInputValues } from '../../../../../visualization/GraphModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'

export class ClearAnimation extends GraphAnimation {
  public static readonly title = 'Clear'
  public static readonly summary = 'Detach every edge before releasing every vertex.'

  public static describe(vertices: number, edges = 0): AlgorithmInformation {
    return {
      name: this.title,
      summary: this.summary,
      time: { best: 'O(V + E)', average: 'O(V + E)', worst: 'O(V + E)', explanation: 'Every stored edge and vertex is released once; constant work for an empty graph. Average is a general bound without a probability model.' },
      memory: { best: 'O(1)', average: 'O(1)', worst: 'O(1)', explanation: 'Map iterators and a few references; trace snapshots are excluded. Animation snapshots and traces are excluded.' },
      terms: [
        { symbol: 'V', meaning: `Number of vertices for this run: V = ${vertices}.` },
        { symbol: 'E', meaning: `Number of edges for this run: E = ${edges}. Parallel edges count separately.` },
        { symbol: 'O', meaning: 'Asymptotic bounds count model operations, assuming expected constant Map/Set access.' },
      ],
    }
  }

  constructor(model: GraphModel, input: GraphInputValues = {}) {
    super(model, new GraphSceneLayout(), 'clear', input, ClearAnimation.title, ClearAnimation.summary)
  }
}
