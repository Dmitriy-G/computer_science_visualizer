import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import type { LinearModel, LinearInputValues } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { HypergraphLayout } from '../../../../AdvancedDataStructures/SpecializedGraphs/Hypergraph/HypergraphLayout.ts'

export class BreadthFirstAnimation extends LinearAnimation {
  public static readonly title = 'Breadth-first traversal'
  public static readonly summary = 'Visit reachable vertices in queue order from a chosen start.'

  public static describe(size: number, edges: number): AlgorithmInformation {
    return {
      name: this.title, summary: this.summary,
      time: { best: 'O(V(H + I + 1))', average: 'O(V(H + I + 1))', worst: 'O(V(H + I + 1))', explanation: 'A neighbor query scans hyperedge incidence sets; over V reachable vertices this gives the displayed conservative bound. Traversal follows shared-hyperedge reachability and returns only original vertices, never incidence marker nodes.' },
      memory: { best: 'O(V)', average: 'O(V)', worst: 'O(V)', explanation: 'The discovery set, queue, and returned order contain at most V vertices; neighbor materialization is also at most V.' },
      terms: [
        { symbol: 'V', meaning: `Original vertex count: V = ${size}.` },
        { symbol: 'H', meaning: `Original hyperedge count: H = ${edges}.` },
        { symbol: 'I', meaning: 'Total number of vertex–hyperedge incidences in the original hypergraph.' },
      ],
    }
  }

  constructor(model: LinearModel, input: LinearInputValues = {}) {
    super(model, new HypergraphLayout(), 'breadth-first', input, BreadthFirstAnimation.title, BreadthFirstAnimation.summary)
  }
}
