import { AdjacencyMatrixPseudocode } from '../AdjacencyMatrixPseudocode.ts'
import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import type { LinearModel, LinearInputValues } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { AdjacencyMatrixLayout } from '../../../../FundamentalDataStructures/Graphs/AdjacencyMatrix/AdjacencyMatrixLayout.ts'

export class BreadthFirstAnimation extends LinearAnimation {
  public static readonly pseudocode = AdjacencyMatrixPseudocode.breadthFirst
  public static readonly title = 'Breadth-first traversal'
  public static readonly summary = 'Visit reachable vertices in queue order from a chosen start.'

  public static describe(size: number, edges: number): AlgorithmInformation {
    return {
      name: this.title, summary: this.summary,
      time: { best: 'O(V)', average: 'O(V²)', worst: 'O(V²)', explanation: 'Even an isolated start scans its full V-cell row. Reaching all vertices scans V rows, giving O(V²); the average row is an upper bound without a reachability distribution. Registry and visited-set operations assume constant-time access.' },
      memory: { best: 'O(1)', average: 'O(V)', worst: 'O(V)', explanation: 'An isolated start needs constant storage. The visited set, queue, returned order, and one materialized neighbor list together use O(V) space. Playback clones and snapshots are excluded; average is an upper bound without a reachability distribution.' },
      terms: [
        { symbol: 'V', meaning: `Original vertex count: V = ${size}.` },
        { symbol: 'E', meaning: `Original stored edge count: E = ${edges}.` },
      ],
    }
  }

  constructor(model: LinearModel, input: LinearInputValues = {}) {
    super(model, new AdjacencyMatrixLayout(), 'breadth-first', input, BreadthFirstAnimation.title, BreadthFirstAnimation.summary)
  }
}
