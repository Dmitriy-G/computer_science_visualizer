import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import type { LinearModel, LinearInputValues } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { FMIndexLayout } from '../FMIndexLayout.ts'

export class BuildAnimation extends LinearAnimation {
  public static readonly title = 'Build text index'
  public static readonly summary = 'Construct BWT, cumulative counts, dense Occ, and sampled suffix positions.'

  public static describe(size: number): AlgorithmInformation {
    return {
      name: this.title,
      summary: this.summary,
      time: { best: 'O(n log n + nσ)', average: 'O(n² log n + nσ)', worst: 'O(n² log n + nσ)', explanation: 'Comparison merge sort constructs a temporary suffix array. Build BWT and an exclusive-prefix rank array for every symbol. The source and full suffix array are discarded after construction. The dense occurrence table is a visible teaching representation, not a compressed rank structure. Playback cloning, scene snapshots, and display formatting are excluded.' },
      memory: { best: 'O(nσ)', average: 'O(nσ)', worst: 'O(nσ)', explanation: 'Temporary suffix order and BWT take O(n) space, dense Occ O(nσ), and one sampled suffix position per s source positions O(n/s). Playback cloning, scene snapshots, and display formatting are excluded.' },
      terms: [
        { symbol: 'n', meaning: `Source length for this operation (including the terminator for suffix-array/FM rows). The committed source currently has ${size} characters; build bounds use replacement input size.` },
        { symbol: 'σ', meaning: 'Alphabet size: at most 26 lowercase letters, plus the unique $ terminator where used.' },
        { symbol: 's', meaning: 'Suffix-position sampling stride: four; every located row needs at most three LF steps.' },
      ],
    }
  }

  constructor(model: LinearModel, input: LinearInputValues = {}) {
    super(model, new FMIndexLayout(), 'build-text', input, BuildAnimation.title, BuildAnimation.summary)
  }
}
