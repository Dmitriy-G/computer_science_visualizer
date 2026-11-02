import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import type { LinearModel, LinearInputValues } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { FlowNetworkLayout } from '../../../../DataStructuresOverview/Graphs/FlowNetwork/FlowNetworkLayout.ts'

export class DepthFirstAnimation extends LinearAnimation {
  public static readonly title = 'Depth-first traversal'
  public static readonly summary = 'Visit reachable vertices recursively before backtracking.'

  public static describe(size: number, edges: number): AlgorithmInformation {
    return {
      name: this.title, summary: this.summary,
      time: { best: 'O(V(E + 1))', average: 'O(V(E + 1))', worst: 'O(V(E + 1))', explanation: 'This edge-record implementation scans the edge list for each reached vertex. It deliberately exposes that representation cost rather than claiming adjacency-list traversal time. The bound is conservative for both average and worst cases. Recursive frames retain materialized neighbor lists as well as the visited set and returned order.' },
      memory: { best: 'O(V + E)', average: 'O(V + E)', worst: 'O(V + E)', explanation: 'Additional storage includes newly allocated records, packed-array replacements, temporary filters, recursive frames, and any returned traversal order where relevant. Original graph storage, playback clones, and scene snapshots are excluded.' },
      terms: [
        { symbol: 'V', meaning: `Original vertex count: V = ${size}.` },
        { symbol: 'E', meaning: `Original stored edge count: E = ${edges}.` },
      ],
    }
  }

  constructor(model: LinearModel, input: LinearInputValues = {}) {
    super(model, new FlowNetworkLayout(), 'depth-first', input, DepthFirstAnimation.title, DepthFirstAnimation.summary)
  }
}
