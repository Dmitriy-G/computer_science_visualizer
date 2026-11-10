import { AdjacencyListPseudocode } from '../AdjacencyListPseudocode.ts'
import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import type { LinearModel, LinearInputValues } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { AdjacencyListLayout } from '../../../../FundamentalDataStructures/Graphs/AdjacencyList/AdjacencyListLayout.ts'

export class DepthFirstAnimation extends LinearAnimation {
  public static readonly pseudocode = AdjacencyListPseudocode.depthFirst
  public static readonly title = 'Depth-first traversal'
  public static readonly summary = 'Visit reachable vertices recursively before backtracking.'

  public static describe(size: number, edges: number): AlgorithmInformation {
    return {
      name: this.title, summary: this.summary,
      time: { best: 'O(1)', average: 'O(V + E)', worst: 'O(V + E)', explanation: 'An isolated start takes constant work even when other vertices exist. Only reached vertices and their outgoing entries are scanned; O(V + E) is a whole-graph upper bound for average and worst cases, without a reachability distribution. Registry and visited-set operations assume constant-time access.' },
      memory: { best: 'O(1)', average: 'O(V + E)', worst: 'O(V + E)', explanation: 'An isolated start needs constant storage. Recursive frames retain their neighbor arrays as well as the visited set and output. Across active frames, neighbor arrays contain at most O(E) entries and vertex bookkeeping uses O(V). Average is an upper bound; playback clones and snapshots are excluded.' },
      terms: [
        { symbol: 'V', meaning: `Original vertex count: V = ${size}.` },
        { symbol: 'E', meaning: `Original stored edge count: E = ${edges}.` },
      ],
    }
  }

  constructor(model: LinearModel, input: LinearInputValues = {}) {
    super(model, new AdjacencyListLayout(), 'depth-first', input, DepthFirstAnimation.title, DepthFirstAnimation.summary)
  }
}
