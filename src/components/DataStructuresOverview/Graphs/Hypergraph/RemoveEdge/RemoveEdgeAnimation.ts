import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import type { LinearModel, LinearInputValues } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { HypergraphLayout } from '../HypergraphLayout.ts'

export class RemoveEdgeAnimation extends LinearAnimation {
  public static readonly title = 'Remove a hyperedge by ID'
  public static readonly summary = 'Remove one hyperedge and all of its incidence links.'

  public static describe(size: number, edges: number): AlgorithmInformation {
    return {
      name: this.title, summary: this.summary,
      time: { best: 'O(H + I)', average: 'O(H + I)', worst: 'O(H + I)', explanation: 'The stable-ID lookup copies hyperedge records and their member arrays before filtering the canonical edge array. This includes all H records and I incidences.' },
      memory: { best: 'O(H + I)', average: 'O(H + I)', worst: 'O(H + I)', explanation: 'The lookup copy includes member arrays, and filtering allocates a replacement edge array. Playback clones and scene snapshots are excluded.' },
      terms: [
        { symbol: 'V', meaning: `Original vertex count: V = ${size}.` },
        { symbol: 'H', meaning: `Original hyperedge count: H = ${edges}.` },
        { symbol: 'I', meaning: 'Total number of vertex–hyperedge incidences in the original hypergraph.' },
      ],
    }
  }

  constructor(model: LinearModel, input: LinearInputValues = {}) {
    super(model, new HypergraphLayout(), 'remove-edge', input, RemoveEdgeAnimation.title, RemoveEdgeAnimation.summary)
  }
}
