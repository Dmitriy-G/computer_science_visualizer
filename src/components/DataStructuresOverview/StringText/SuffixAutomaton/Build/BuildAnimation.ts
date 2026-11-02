import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import type { LinearModel, LinearInputValues } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { SuffixAutomatonLayout } from '../SuffixAutomatonLayout.ts'

export class BuildAnimation extends LinearAnimation {
  public static readonly title = 'Build from text'
  public static readonly summary = 'Extend the automaton character by character, cloning states when needed.'

  public static describe(size: number): AlgorithmInformation {
    return {
      name: this.title,
      summary: this.summary,
      time: { best: 'O(n)', average: 'O(nσ)', worst: 'O(nσ)', explanation: 'The standard online construction creates O(n) states and amortizes suffix-link walks and redirections across the build. Copying a clone transition map costs at most σ per clone. With the fixed 26-letter alphabet, construction is linear in source size; array append is measured amortized. Playback cloning, scene snapshots, and display formatting are excluded.' },
      memory: { best: 'O(n)', average: 'O(nσ)', worst: 'O(nσ)', explanation: 'Allocate source characters, states, suffix links, and transition maps. The alphabet is fixed to lowercase a-z. Playback cloning, scene snapshots, and display formatting are excluded.' },
      terms: [
        { symbol: 'n', meaning: `Source length for this operation (including the terminator for suffix-array/FM rows). The committed source currently has ${size} characters; build bounds use replacement input size.` },
        { symbol: 'σ', meaning: 'Alphabet size: at most 26 lowercase letters, plus the unique $ terminator where used.' },
      ],
    }
  }

  constructor(model: LinearModel, input: LinearInputValues = {}) {
    super(model, new SuffixAutomatonLayout(), 'build-text', input, BuildAnimation.title, BuildAnimation.summary)
  }
}
