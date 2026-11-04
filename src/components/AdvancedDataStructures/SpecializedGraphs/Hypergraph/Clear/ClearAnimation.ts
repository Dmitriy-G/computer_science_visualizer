import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import type { LinearModel, LinearInputValues } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { HypergraphLayout } from '../HypergraphLayout.ts'

export class ClearAnimation extends LinearAnimation {
  public static readonly title = 'Clear'
  public static readonly summary = 'Release vertices and repair their hyperedge incidences.'

  public static describe(size: number, edges: number): AlgorithmInformation {
    return {
      name: this.title, summary: this.summary,
      time: { best: 'O(V(V + H + I²))', average: 'O(V(V + H + I²))', worst: 'O(V(V + H + I²))', explanation: 'Release vertices one at a time, repairing incidences and coalescing duplicate sets after each deletion. Multiply a conservative per-deletion bound by the original V; later graphs shrink and empty input finishes in constant work.' },
      memory: { best: 'O(V + I)', average: 'O(V + I)', worst: 'O(V + I)', explanation: 'Additional storage includes newly allocated records, packed-array replacements, temporary filters, recursive frames, and any returned traversal order where relevant. Original graph storage, playback clones, and scene snapshots are excluded.' },
      terms: [
        { symbol: 'V', meaning: `Original vertex count: V = ${size}.` },
        { symbol: 'H', meaning: `Original hyperedge count: H = ${edges}.` },
        { symbol: 'I', meaning: 'Total number of vertex–hyperedge incidences in the original hypergraph.' },
      ],
    }
  }

  constructor(model: LinearModel, input: LinearInputValues = {}) {
    super(model, new HypergraphLayout(), 'clear', input, ClearAnimation.title, ClearAnimation.summary)
  }
}
