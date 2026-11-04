import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import type { LinearModel, LinearInputValues } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { CompleteGraphLayout } from '../CompleteGraphLayout.ts'

export class AddVertexAnimation extends LinearAnimation {
  public static readonly title = 'Add a fully connected vertex'
  public static readonly summary = 'Add a new vertex and connect it atomically to every existing vertex.'

  public static describe(size: number, edges: number): AlgorithmInformation {
    return {
      name: this.title, summary: this.summary,
      time: { best: 'O(V)', average: 'O(V)', worst: 'O(V)', explanation: 'The new vertex requires one edge to each existing vertex. No pairwise duplicate scan is needed because the new vertex did not previously exist. Empty insertion takes O(1).' },
      memory: { best: 'O(V)', average: 'O(V)', worst: 'O(V)', explanation: 'Additional storage includes newly allocated records, packed-array replacements, temporary filters, recursive frames, and any returned traversal order where relevant. Original graph storage, playback clones, and scene snapshots are excluded.' },
      terms: [
        { symbol: 'V', meaning: `Original vertex count: V = ${size}.` },
        { symbol: 'E', meaning: `Original stored edge count: E = ${edges}.` },
      ],
    }
  }

  constructor(model: LinearModel, input: LinearInputValues = {}) {
    super(model, new CompleteGraphLayout(), 'add-vertex', input, AddVertexAnimation.title, AddVertexAnimation.summary)
  }
}
