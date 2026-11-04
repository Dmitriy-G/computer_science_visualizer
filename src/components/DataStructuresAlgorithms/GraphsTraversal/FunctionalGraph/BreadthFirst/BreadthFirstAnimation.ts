import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import type { LinearModel, LinearInputValues } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { FunctionalGraphLayout } from '../../../../FundamentalDataStructures/Graphs/FunctionalGraph/FunctionalGraphLayout.ts'

export class BreadthFirstAnimation extends LinearAnimation {
  public static readonly title = 'Breadth-first traversal'
  public static readonly summary = 'Visit reachable vertices in queue order from a chosen start.'

  public static describe(size: number, edges: number): AlgorithmInformation {
    return {
      name: this.title, summary: this.summary,
      time: { best: 'O(V(E + 1))', average: 'O(V(E + 1))', worst: 'O(V(E + 1))', explanation: 'This edge-record implementation scans the edge list for each reached vertex. It deliberately exposes that representation cost rather than claiming adjacency-list traversal time. The bound is conservative for both average and worst cases.' },
      memory: { best: 'O(V)', average: 'O(V)', worst: 'O(V)', explanation: 'The discovery set, queue, and returned order contain at most V vertices; neighbor materialization is also at most V.' },
      terms: [
        { symbol: 'V', meaning: `Original vertex count: V = ${size}.` },
        { symbol: 'E', meaning: `Original stored edge count: E = ${edges}.` },
      ],
    }
  }

  constructor(model: LinearModel, input: LinearInputValues = {}) {
    super(model, new FunctionalGraphLayout(), 'breadth-first', input, BreadthFirstAnimation.title, BreadthFirstAnimation.summary)
  }
}
