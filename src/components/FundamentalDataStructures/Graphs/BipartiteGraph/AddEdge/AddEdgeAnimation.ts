import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import type { LinearModel, LinearInputValues } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { BipartiteGraphLayout } from '../BipartiteGraphLayout.ts'

export class AddEdgeAnimation extends LinearAnimation {
  public static readonly title = 'Add a cross-partition edge'
  public static readonly summary = 'Connect L to R; reject same-side edges and self-loops.'

  public static describe(size: number, edges: number): AlgorithmInformation {
    return {
      name: this.title, summary: this.summary,
      time: { best: 'O(V + E)', average: 'O(V + E)', worst: 'O(V + E)', explanation: 'These are conservative upper bounds for this implementation, including stable-ID lookup, duplicate validation, canonical storage updates, and managed-array copies where relevant. No random-input assumption is made. Empty inputs and rejected requests can finish sooner.' },
      memory: { best: 'O(V + E)', average: 'O(V + E)', worst: 'O(V + E)', explanation: 'Additional storage includes newly allocated records, packed-array replacements, temporary filters, recursive frames, and any returned traversal order where relevant. Original graph storage, playback clones, and scene snapshots are excluded.' },
      terms: [
        { symbol: 'V', meaning: `Original vertex count: V = ${size}.` },
        { symbol: 'E', meaning: `Original stored edge count: E = ${edges}.` },
      ],
    }
  }

  constructor(model: LinearModel, input: LinearInputValues = {}) {
    super(model, new BipartiteGraphLayout(), 'add-edge', input, AddEdgeAnimation.title, AddEdgeAnimation.summary)
  }
}
