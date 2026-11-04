import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import type { LinearModel, LinearInputValues } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { AhoCorasickAutomatonLayout } from '../AhoCorasickAutomatonLayout.ts'

export class BuildAnimation extends LinearAnimation {
  public static readonly title = 'Build pattern dictionary'
  public static readonly summary = 'Build a trie and assign failure and terminal output links breadth first.'

  public static describe(size: number): AlgorithmInformation {
    return {
      name: this.title,
      summary: this.summary,
      time: { best: 'O(L)', average: 'O(Lh)', worst: 'O(Lh)', explanation: 'Trie construction reads L pattern characters. This sparse teaching variant follows failure chains explicitly while assigning links, bounded conservatively by h per edge. It does not use a completed transition table or claim linear-time preprocessing. Dictionary validation compares at most sixteen words. Playback cloning, scene snapshots, and display formatting are excluded.' },
      memory: { best: 'O(L)', average: 'O(L)', worst: 'O(L)', explanation: 'Store pattern strings, trie states, one failure/output link per state, and a BFS queue. Terminal outputs are linked rather than copied into every descendant. Playback cloning, scene snapshots, and display formatting are excluded.' },
      terms: [
        { symbol: 'L', meaning: 'Total number of letters across the replacement dictionary, at most 128.' },
        { symbol: 'h', meaning: 'Maximum pattern length in the dictionary, at most 32 letters.' },
      ],
    }
  }

  constructor(model: LinearModel, input: LinearInputValues = {}) {
    super(model, new AhoCorasickAutomatonLayout(), 'build-words', input, BuildAnimation.title, BuildAnimation.summary)
  }
}
