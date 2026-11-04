import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import type { LinearModel, LinearInputValues } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { AdjacencyListLayout } from '../../../../FundamentalDataStructures/Graphs/AdjacencyList/AdjacencyListLayout.ts'

export class DepthFirstAnimation extends LinearAnimation {
  public static readonly title = 'Depth-first traversal'
  public static readonly summary = 'Visit reachable vertices recursively before backtracking.'

  public static describe(size: number, edges: number): AlgorithmInformation {
    return {
      name: this.title, summary: this.summary,
      time: { best: 'O(V + E)', average: 'O(V + E)', worst: 'O(V + E)', explanation: 'Each reachable vertex and its stored outgoing entries are examined once. The bound covers the whole graph and is conservative for a smaller reachable component; cached ID/position Maps assume expected constant lookup. Recursive frames retain materialized neighbor lists as well as the visited set and returned order.' },
      memory: { best: 'O(V + E)', average: 'O(V + E)', worst: 'O(V + E)', explanation: 'Additional storage includes newly allocated records, packed-array replacements, temporary filters, recursive frames, and any returned traversal order where relevant. Original graph storage, playback clones, and scene snapshots are excluded.' },
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
