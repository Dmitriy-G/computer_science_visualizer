import { EdgeListPseudocode } from '../EdgeListPseudocode.ts'
import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import type { LinearModel, LinearInputValues } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { EdgeListLayout } from '../../../../FundamentalDataStructures/Graphs/EdgeList/EdgeListLayout.ts'

export class DepthFirstAnimation extends LinearAnimation {
  public static readonly pseudocode = EdgeListPseudocode.depthFirst
  public static readonly title = 'Depth-first traversal'
  public static readonly summary = 'Visit reachable vertices recursively before backtracking.'

  public static describe(size: number, edges: number): AlgorithmInformation {
    return {
      name: this.title, summary: this.summary,
      time: { best: 'O(E + 1)', average: 'O(V(E + 1))', worst: 'O(V(E + 1))', explanation: 'An isolated start still scans all E edge records once. Each reached vertex repeats that scan, giving O(V(E + 1)) as an average/worst upper bound without a reachability distribution. Registry and set operations assume constant-time access.' },
      memory: { best: 'O(1)', average: 'O(V + E)', worst: 'O(V + E)', explanation: 'An isolated start needs constant storage. Recursive frames retain their neighbor arrays as well as the visited set and output. Across active frames, neighbor arrays contain at most O(E) entries and vertex bookkeeping uses O(V). Average is an upper bound; playback clones and snapshots are excluded.' },
      terms: [
        { symbol: 'V', meaning: `Original vertex count: V = ${size}.` },
        { symbol: 'E', meaning: `Original stored edge count: E = ${edges}.` },
      ],
    }
  }

  constructor(model: LinearModel, input: LinearInputValues = {}) {
    super(model, new EdgeListLayout(), 'depth-first', input, DepthFirstAnimation.title, DepthFirstAnimation.summary)
  }
}
