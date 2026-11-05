import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import type { LinearModel, LinearInputValues } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { FlowNetworkLayout } from '../../../../AdvancedDataStructures/SpecializedGraphs/FlowNetwork/FlowNetworkLayout.ts'

export class BreadthFirstAnimation extends LinearAnimation {
  public static readonly title = 'Breadth-first traversal'
  public static readonly summary = 'Visit reachable vertices in queue order from a chosen start.'

  public static describe(size: number, edges: number): AlgorithmInformation {
    return {
      name: this.title, summary: this.summary,
      time: { best: 'O(E + 1)', average: 'O(V(E + 1))', worst: 'O(V(E + 1))', explanation: 'An isolated start still scans all E edge records once. Each reached vertex repeats that scan, giving O(V(E + 1)) as an average/worst upper bound without a reachability distribution. Registry and set operations assume constant-time access.' },
      memory: { best: 'O(1)', average: 'O(V)', worst: 'O(V)', explanation: 'An isolated start needs constant storage. The visited set, queue, returned order, and one materialized neighbor list together use O(V) space. Playback clones and snapshots are excluded; average is an upper bound without a reachability distribution.' },
      terms: [
        { symbol: 'V', meaning: `Original vertex count: V = ${size}.` },
        { symbol: 'E', meaning: `Original stored edge count: E = ${edges}.` },
      ],
    }
  }

  constructor(model: LinearModel, input: LinearInputValues = {}) {
    super(model, new FlowNetworkLayout(), 'breadth-first', input, BreadthFirstAnimation.title, BreadthFirstAnimation.summary)
  }
}
