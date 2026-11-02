import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import type { LinearModel, LinearInputValues } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { HypergraphLayout } from '../HypergraphLayout.ts'

export class AddEdgeAnimation extends LinearAnimation {
  public static readonly title = 'Add a hyperedge'
  public static readonly summary = 'Collect 2–16 distinct existing vertex values into one incidence set.'

  public static describe(size: number, edges: number): AlgorithmInformation {
    return {
      name: this.title, summary: this.summary,
      time: { best: 'O(V + H + VI)', average: 'O(V + H + VI)', worst: 'O(V + H + VI)', explanation: 'Resolve up to V proposed members, then compare their set with existing hyperedges. Array membership checks can scan I stored incidences once per proposed member. These are conservative upper bounds; shorter or rejected inputs can finish sooner.' },
      memory: { best: 'O(V)', average: 'O(V)', worst: 'O(V)', explanation: 'Additional storage includes newly allocated records, packed-array replacements, temporary filters, recursive frames, and any returned traversal order where relevant. Original graph storage, playback clones, and scene snapshots are excluded.' },
      terms: [
        { symbol: 'V', meaning: `Original vertex count: V = ${size}.` },
        { symbol: 'H', meaning: `Original hyperedge count: H = ${edges}.` },
        { symbol: 'I', meaning: 'Total number of vertex–hyperedge incidences in the original hypergraph.' },
      ],
    }
  }

  constructor(model: LinearModel, input: LinearInputValues = {}) {
    super(model, new HypergraphLayout(), 'add-edge', input, AddEdgeAnimation.title, AddEdgeAnimation.summary)
  }
}
