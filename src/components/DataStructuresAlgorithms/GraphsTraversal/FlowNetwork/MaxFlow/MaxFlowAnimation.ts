import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import type { LinearModel, LinearInputValues } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { FlowNetworkLayout } from '../../../../AdvancedDataStructures/SpecializedGraphs/FlowNetwork/FlowNetworkLayout.ts'

export class MaxFlowAnimation extends LinearAnimation {
  public static readonly title = 'Edmonds–Karp maximum flow'
  public static readonly summary = 'Reset flow, find residual paths with BFS, and augment until no source-to-sink path remains.'

  public static describe(size: number, edges: number): AlgorithmInformation {
    return {
      name: this.title, summary: this.summary,
      time: { best: 'O(V + E)', average: 'O(VE² + V + E)', worst: 'O(VE² + V + E)', explanation: 'The residual adjacency lists contain forward and reverse arcs. BFS-selected augmenting paths give O(VE²) work; initialization costs O(V + E), including when E = 0. The average row is a conservative upper bound, not a random-capacity expectation. BigInt keeps capacities, cancellations, and total flow exact.' },
      memory: { best: 'O(V + E)', average: 'O(V + E)', worst: 'O(V + E)', explanation: 'Residual adjacency lists use O(V + E); each BFS uses O(V) discovery, predecessor, queue, and augmenting-path records.' },
      terms: [
        { symbol: 'V', meaning: `Original vertex count: V = ${size}.` },
        { symbol: 'E', meaning: `Original stored edge count: E = ${edges}.` },
      ],
    }
  }

  constructor(model: LinearModel, input: LinearInputValues = {}) {
    super(model, new FlowNetworkLayout(), 'max-flow', input, MaxFlowAnimation.title, MaxFlowAnimation.summary)
  }
}
