import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import type { LinearModel, LinearInputValues } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { AhoCorasickAutomatonLayout } from '../AhoCorasickAutomatonLayout.ts'

export class ScanAnimation extends LinearAnimation {
  public static readonly title = 'Scan text for all patterns'
  public static readonly summary = 'Follow transitions and failure/output links, reporting all overlapping matches.'

  public static describe(size: number): AlgorithmInformation {
    return {
      name: this.title,
      summary: this.summary,
      time: { best: 'O(t)', average: 'O(t + z)', worst: 'O(t + z)', explanation: 'Each input character advances at most one trie level; failure moves decrease depth, so total scan fallback work is linear. Following terminal output links costs O(z). Bounds count output records; serializing result text adds work proportional to reported characters. Scanning an empty dictionary reports no matches. Playback cloning, scene snapshots, and display formatting are excluded.' },
      memory: { best: 'O(1)', average: 'O(z + 1)', worst: 'O(z + 1)', explanation: 'Store z match records and the formatted result. Pattern lengths are bounded by 32 and input length by 128, so each output record has bounded textual size. Playback cloning, scene snapshots, and display formatting are excluded.' },
      terms: [
        { symbol: 't', meaning: 'Number of letters in the text being scanned, at most 128.' },
        { symbol: 'z', meaning: 'Number of reported matches or source positions, including overlaps.' },
        { symbol: 'O(1)', meaning: 'Constant operation work or additional storage under the stated representation assumptions.' },
      ],
    }
  }

  constructor(model: LinearModel, input: LinearInputValues = {}) {
    super(model, new AhoCorasickAutomatonLayout(), 'search-text', input, ScanAnimation.title, ScanAnimation.summary)
  }
}
