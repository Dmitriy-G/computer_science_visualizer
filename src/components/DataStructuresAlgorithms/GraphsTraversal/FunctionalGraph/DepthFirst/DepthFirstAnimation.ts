import { FunctionalGraphPseudocode } from '../FunctionalGraphPseudocode.ts'
import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import type { LinearModel, LinearInputValues } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { FunctionalGraphLayout } from '../../../../FundamentalDataStructures/Graphs/FunctionalGraph/FunctionalGraphLayout.ts'

export class DepthFirstAnimation extends LinearAnimation {
  public static readonly pseudocode = FunctionalGraphPseudocode.depthFirst
  public static readonly title = 'Depth-first traversal'
  public static readonly summary = 'Visit reachable vertices recursively before backtracking.'

  public static describe(size: number, edges: number): AlgorithmInformation {
    return {
      name: this.title, summary: this.summary,
      time: { best: 'O(V)', average: 'O(V(E + 1))', worst: 'O(V(E + 1))', explanation: 'Each neighbor query scans all E = V stored edges. A self-loop start visits only itself in O(V); reaching V vertices takes O(V²). Average is a whole-graph upper bound without a reachability distribution. Registry and set operations assume constant-time access.' },
      memory: { best: 'O(1)', average: 'O(V)', worst: 'O(V)', explanation: 'An isolated or self-loop start needs constant storage. Recursive frames retain their neighbor arrays as well as the visited set and output. Each functional vertex has one neighbor, so frames and output total O(V). Average is an upper bound; playback clones and snapshots are excluded.' },
      terms: [
        { symbol: 'V', meaning: `Original vertex count: V = ${size}.` },
        { symbol: 'E', meaning: `Original stored edge count: E = ${edges}.` },
      ],
    }
  }

  constructor(model: LinearModel, input: LinearInputValues = {}) {
    super(model, new FunctionalGraphLayout(), 'depth-first', input, DepthFirstAnimation.title, DepthFirstAnimation.summary)
  }
}
