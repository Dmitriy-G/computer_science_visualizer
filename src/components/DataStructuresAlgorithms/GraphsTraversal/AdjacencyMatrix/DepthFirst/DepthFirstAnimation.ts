import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import type { LinearModel, LinearInputValues } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { AdjacencyMatrixLayout } from '../../../../FundamentalDataStructures/Graphs/AdjacencyMatrix/AdjacencyMatrixLayout.ts'

export class DepthFirstAnimation extends LinearAnimation {
  public static readonly title = 'Depth-first traversal'
  public static readonly summary = 'Visit reachable vertices recursively before backtracking.'

  public static describe(size: number, edges: number): AlgorithmInformation {
    return {
      name: this.title, summary: this.summary,
      time: { best: 'O(V)', average: 'O(V²)', worst: 'O(V²)', explanation: 'Even an isolated start scans its full V-cell row. Reaching all vertices scans V rows, giving O(V²); the average row is an upper bound without a reachability distribution. Registry and visited-set operations assume constant-time access.' },
      memory: { best: 'O(1)', average: 'O(V + E)', worst: 'O(V + E)', explanation: 'An isolated start needs constant storage. Recursive frames retain their neighbor arrays as well as the visited set and output. Across active frames, neighbor arrays contain at most O(E) entries and vertex bookkeeping uses O(V). Average is an upper bound; playback clones and snapshots are excluded.' },
      terms: [
        { symbol: 'V', meaning: `Original vertex count: V = ${size}.` },
        { symbol: 'E', meaning: `Original stored edge count: E = ${edges}.` },
      ],
    }
  }

  constructor(model: LinearModel, input: LinearInputValues = {}) {
    super(model, new AdjacencyMatrixLayout(), 'depth-first', input, DepthFirstAnimation.title, DepthFirstAnimation.summary)
  }
}
