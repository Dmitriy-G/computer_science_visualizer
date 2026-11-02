import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import type { LinearModel, LinearInputValues } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { DAWGLayout } from '../DAWGLayout.ts'

export class BuildAnimation extends LinearAnimation {
  public static readonly title = 'Build word dictionary'
  public static readonly summary = 'Construct a trie, then intern equivalent states from leaves to the initial state.'

  public static describe(size: number): AlgorithmInformation {
    return {
      name: this.title,
      summary: this.summary,
      time: { best: 'O(L)', average: 'O(L(log σ + log(L + 1)))', worst: 'O(L²σ log(L + 1))', explanation: 'Sort each trie node\'s outgoing labels and intern signatures made from the final flag and canonical child IDs. Average assumes expected constant signature-register Map access; the worst bound conservatively allows register collisions and signature comparison. This is trie-then-minimize construction, not incremental insertion. Playback cloning, scene snapshots, and display formatting are excluded.' },
      memory: { best: 'O(L)', average: 'O(L log(L + 1))', worst: 'O(L log(L + 1))', explanation: 'The construction trie and canonical DAG have O(L) edges; temporary textual signatures include child IDs with O(log(L + 1)) digits. A depth-first stack is bounded by word length. Playback cloning, scene snapshots, and display formatting are excluded.' },
      terms: [
        { symbol: 'L', meaning: 'Total number of letters across the replacement dictionary, at most 128.' },
        { symbol: 'σ', meaning: 'Alphabet size: at most 26 lowercase letters, plus the unique $ terminator where used.' },
      ],
    }
  }

  constructor(model: LinearModel, input: LinearInputValues = {}) {
    super(model, new DAWGLayout(), 'build-words', input, BuildAnimation.title, BuildAnimation.summary)
  }
}
