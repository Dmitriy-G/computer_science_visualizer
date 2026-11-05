import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import type { LinearModel, LinearInputValues } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { HypergraphLayout } from '../../../../AdvancedDataStructures/SpecializedGraphs/Hypergraph/HypergraphLayout.ts'

export class DepthFirstAnimation extends LinearAnimation {
  public static readonly title = 'Depth-first traversal'
  public static readonly summary = 'Visit reachable vertices recursively before backtracking.'

  public static describe(size: number, edges: number): AlgorithmInformation {
    return {
      name: this.title, summary: this.summary,
      time: { best: 'O(H + I + 1)', average: 'O(V(H + I + 1))', worst: 'O(V(H + I + 1))', explanation: 'An isolated start still scans all H hyperedges and I incidences. Repeating this neighbor query for up to V reached vertices gives the displayed average/worst upper bound, without a reachability distribution. Set operations assume constant-time access.' },
      memory: { best: 'O(1)', average: 'O(V²)', worst: 'O(V²)', explanation: 'An isolated start needs constant storage. Recursive frames retain their neighbor arrays as well as the visited set and output. Hyperedges can induce V neighbors at each of V active frames, giving O(V²). Average is an upper bound; playback clones and snapshots are excluded.' },
      terms: [
        { symbol: 'V', meaning: `Original vertex count: V = ${size}.` },
        { symbol: 'H', meaning: `Original hyperedge count: H = ${edges}.` },
        { symbol: 'I', meaning: 'Total number of vertex–hyperedge incidences in the original hypergraph.' },
      ],
    }
  }

  constructor(model: LinearModel, input: LinearInputValues = {}) {
    super(model, new HypergraphLayout(), 'depth-first', input, DepthFirstAnimation.title, DepthFirstAnimation.summary)
  }
}
