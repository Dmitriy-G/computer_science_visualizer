import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import type { LinearModel, LinearInputValues } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { AdjacencyListLayout } from '../../../../DataStructuresOverview/Graphs/AdjacencyList/AdjacencyListLayout.ts'

export class BreadthFirstAnimation extends LinearAnimation {
  public static readonly title = 'Breadth-first traversal'
  public static readonly summary = 'Visit reachable vertices in queue order from a chosen start.'

  public static describe(size: number, edges: number): AlgorithmInformation {
    return {
      name: this.title, summary: this.summary,
      time: { best: 'O(V + E)', average: 'O(V + E)', worst: 'O(V + E)', explanation: 'Each reachable vertex and its stored outgoing entries are examined once. The bound covers the whole graph and is conservative for a smaller reachable component; cached ID/position Maps assume expected constant lookup.' },
      memory: { best: 'O(V)', average: 'O(V)', worst: 'O(V)', explanation: 'The discovery set, queue, and returned order contain at most V vertices; neighbor materialization is also at most V.' },
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
