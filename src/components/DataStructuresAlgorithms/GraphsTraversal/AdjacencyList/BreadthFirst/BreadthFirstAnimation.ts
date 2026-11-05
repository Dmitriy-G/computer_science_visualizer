import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import type { LinearModel, LinearInputValues } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { AdjacencyListLayout } from '../../../../FundamentalDataStructures/Graphs/AdjacencyList/AdjacencyListLayout.ts'

export class BreadthFirstAnimation extends LinearAnimation {
  public static readonly title = 'Breadth-first traversal'
  public static readonly summary = 'Visit reachable vertices in queue order from a chosen start.'

  public static describe(size: number, edges: number): AlgorithmInformation {
    return {
      name: this.title, summary: this.summary,
      time: { best: 'O(1)', average: 'O(V + E)', worst: 'O(V + E)', explanation: 'An isolated start takes constant work even when other vertices exist. Only reached vertices and their outgoing entries are scanned; O(V + E) is a whole-graph upper bound for average and worst cases, without a reachability distribution. Registry and visited-set operations assume constant-time access.' },
      memory: { best: 'O(1)', average: 'O(V)', worst: 'O(V)', explanation: 'An isolated start needs constant storage. The visited set, queue, returned order, and one materialized neighbor list together use O(V) space. Playback clones and snapshots are excluded; average is an upper bound without a reachability distribution.' },
      terms: [
        { symbol: 'V', meaning: `Original vertex count: V = ${size}.` },
        { symbol: 'E', meaning: `Original stored edge count: E = ${edges}.` },
      ],
    }
  }

  constructor(model: LinearModel, input: LinearInputValues = {}) {
    super(model, new AdjacencyListLayout(), 'breadth-first', input, BreadthFirstAnimation.title, BreadthFirstAnimation.summary)
  }
}
