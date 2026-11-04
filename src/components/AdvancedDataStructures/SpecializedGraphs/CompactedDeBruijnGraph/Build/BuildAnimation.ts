import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import type { LinearModel, LinearInputValues } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { CompactedDeBruijnGraphLayout } from '../CompactedDeBruijnGraphLayout.ts'

export class BuildAnimation extends LinearAnimation {
  public static readonly title = 'Build from DNA'
  public static readonly summary = 'Create distinct 3-mers, connect overlaps, and compact unitigs.'

  public static describe(size: number): AlgorithmInformation {
    return {
      name: this.title,
      summary: this.summary,
      time: { best: 'O(m²)', average: 'O(m²)', worst: 'O(m²)', explanation: 'Collects at most m distinct k-mers and checks all pairs for induced edges before linear path compaction. The conservative storage bound includes overlap edges. Rows are upper bounds for this teaching variant; empty or early-return cases can finish sooner.' },
      memory: { best: 'O(m²)', average: 'O(m²)', worst: 'O(m²)', explanation: 'Includes working collections and output required by this operation. Playback clones, recorded trace frames, and scene snapshots are excluded.' },
      terms: [
        { symbol: 'm', meaning: 'Input text length or the number of bounded words considered by this operation.' },
        { symbol: 'O(m²)', meaning: 'Quadratic work or storage in the input text length.' },
      ],
    }
  }

  constructor(model: LinearModel, input: LinearInputValues = { text: 'acgttgcagtac' }) {
    super(model, new CompactedDeBruijnGraphLayout(), 'build-text', input, BuildAnimation.title, BuildAnimation.summary)
  }
}
