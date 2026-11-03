import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import type { LinearModel, LinearInputValues } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { CompactedDeBruijnGraphLayout } from '../CompactedDeBruijnGraphLayout.ts'

export class SearchAnimation extends LinearAnimation {
  public static readonly title = 'Check a DNA walk'
  public static readonly summary = 'Check each query k-mer and the induced edge between consecutive k-mers.'

  public static describe(size: number): AlgorithmInformation {
    return {
      name: this.title,
      summary: this.summary,
      time: { best: 'O(m)', average: 'O(m)', worst: 'O(m)', explanation: 'Fixed k=3 bounds the alphabet and each adjacency list. Up to m query bases are checked with expected Map lookup. A graph walk need not occur in the original source. Rows are upper bounds for this teaching variant; empty or early-return cases can finish sooner.' },
      memory: { best: 'O(1)', average: 'O(1)', worst: 'O(1)', explanation: 'Includes working collections and output required by this operation. Playback clones, recorded trace frames, and scene snapshots are excluded.' },
      terms: [
        { symbol: 'm', meaning: 'Input text length or the number of bounded words considered by this operation.' },
        { symbol: 'O(m)', meaning: 'Linear work or storage in the input text length.' },
        { symbol: 'O(1)', meaning: 'Constant work or storage under the stated fixed word, universe, or capacity bounds.' },
      ],
    }
  }

  constructor(model: LinearModel, input: LinearInputValues = { text: 'acgtt' }) {
    super(model, new CompactedDeBruijnGraphLayout(), 'search-text', input, SearchAnimation.title, SearchAnimation.summary)
  }
}
