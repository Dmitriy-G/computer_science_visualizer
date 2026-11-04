import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import type { LinearModel, LinearInputValues } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { AdjacencyMatrixLayout } from '../AdjacencyMatrixLayout.ts'

export class InspectStorageAnimation extends LinearAnimation {
  public static readonly title = 'Inspect matrix cells'
  public static readonly summary = 'Scan rows and columns to distinguish stored edges from zero cells.'

  public static describe(size: number, edges: number): AlgorithmInformation {
    return {
      name: this.title, summary: this.summary,
      time: { best: 'O(V²)', average: 'O(V²)', worst: 'O(V²)', explanation: 'These are conservative upper bounds for this implementation, including stable-ID lookup, duplicate validation, canonical storage updates, and managed-array copies where relevant. No random-input assumption is made. Empty inputs and rejected requests can finish sooner.' },
      memory: { best: 'O(1)', average: 'O(1)', worst: 'O(1)', explanation: 'Additional storage includes newly allocated records, packed-array replacements, temporary filters, recursive frames, and any returned traversal order where relevant. Original graph storage, playback clones, and scene snapshots are excluded.' },
      terms: [
        { symbol: 'V', meaning: `Original vertex count: V = ${size}.` },
        { symbol: 'E', meaning: `Original stored edge count: E = ${edges}.` },
      ],
    }
  }

  constructor(model: LinearModel, input: LinearInputValues = {}) {
    super(model, new AdjacencyMatrixLayout(), 'inspect-storage', input, InspectStorageAnimation.title, InspectStorageAnimation.summary)
  }
}
