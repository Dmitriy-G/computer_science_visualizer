import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import type { LinearModel, LinearInputValues } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { DisjointSetLayout } from '../DisjointSetLayout.ts'

export class UnionAnimation extends LinearAnimation {
  public static readonly title = 'Union components'
  public static readonly summary = 'Find two representatives and link the lower-rank root under the higher-rank root.'

  public static describe(size: number): AlgorithmInformation {
    return {
      name: this.title,
      summary: this.summary,
      time: { best: 'O(1)', average: 'O(alpha(n))', worst: 'O(n log n)', explanation: 'Both members are validated before any compression. The average is amortized over sequences with expected constant Map access; one operation follows at most logarithmic parent chains. Conservative worst time includes linear-cost Map accesses. Equal roots do not add a link. Playback clones, traces, and scene formatting are excluded.' },
      memory: { best: 'O(1)', average: 'O(1)', worst: 'O(1)', explanation: 'Find uses two iterative passes and union changes a parent and possibly a rank. Playback clones and snapshots are excluded.' },
      terms: [
        { symbol: 'n', meaning: `Number of members in the forest; currently ${size} entries.` },
        { symbol: 'alpha(n)', meaning: 'Inverse Ackermann growth in the amortized union-find sequence bound; it is not a per-operation worst-case guarantee.' },
        { symbol: 'O(1)', meaning: 'Constant work or additional storage, independent of the input size.' },
        { symbol: 'O(alpha(n))', meaning: 'Amortized inverse-Ackermann growth over a sequence of ranked union and compressed find operations.' },
        { symbol: 'O(n log n)', meaning: 'At most logarithmically many parent steps with linear-cost Map access per step.' },
      ],
    }
  }

  constructor(model: LinearModel, input: LinearInputValues = { first: 80, second: 90 }) {
    super(model, new DisjointSetLayout(), 'union', input, UnionAnimation.title, UnionAnimation.summary)
  }
}
