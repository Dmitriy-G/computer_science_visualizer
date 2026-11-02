import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import type { LinearModel, LinearInputValues } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { SuffixAutomatonLayout } from '../SuffixAutomatonLayout.ts'

export class AppendAnimation extends LinearAnimation {
  public static readonly title = 'Append text'
  public static readonly summary = 'Extend existing end-position classes without rebuilding the source index.'

  public static describe(size: number): AlgorithmInformation {
    return {
      name: this.title,
      summary: this.summary,
      time: { best: 'O(k)', average: 'O(kσ) amortized', worst: 'O((n + k)σ)', explanation: 'Across an append-only sequence, extension work is amortized linear for a fixed alphabet. One request can traverse and redirect transitions from existing states. Reject source lengths above 64 before changing states or IDs. Playback cloning, scene snapshots, and display formatting are excluded.' },
      memory: { best: 'O(k)', average: 'O(kσ)', worst: 'O(kσ)', explanation: 'At most two states are added per appended character, with at most σ copied transitions per clone. Existing states are edited on the playback clone. Playback cloning, scene snapshots, and display formatting are excluded.' },
      terms: [
        { symbol: 'n', meaning: `Source length for this operation (including the terminator for suffix-array/FM rows). The committed source currently has ${size} characters; build bounds use replacement input size.` },
        { symbol: 'k', meaning: 'Number of source characters supplied in this append request.' },
        { symbol: 'σ', meaning: 'Alphabet size: at most 26 lowercase letters, plus the unique $ terminator where used.' },
      ],
    }
  }

  constructor(model: LinearModel, input: LinearInputValues = {}) {
    super(model, new SuffixAutomatonLayout(), 'append-text', input, AppendAnimation.title, AppendAnimation.summary)
  }
}
