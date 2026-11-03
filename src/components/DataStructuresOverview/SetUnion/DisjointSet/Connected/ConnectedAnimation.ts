import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import type { LinearModel, LinearInputValues } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { DisjointSetLayout } from '../DisjointSetLayout.ts'

export class ConnectedAnimation extends LinearAnimation {
  public static readonly title = 'Check connectivity'
  public static readonly summary = 'Compare two representatives, compressing both find paths.'

  public static describe(size: number): AlgorithmInformation {
    return {
      name: this.title,
      summary: this.summary,
      time: { best: 'O(1)', average: 'O(alpha(n))', worst: 'O(n log n)', explanation: 'Root inputs take constant parent work. The average is an amortized sequence bound under expected constant Map access. A single operation follows logarithmic-depth chains; conservative worst time includes linear-cost Map accesses. Missing members reject before changes. Playback clones, traces, and scene formatting are excluded.' },
      memory: { best: 'O(1)', average: 'O(1)', worst: 'O(1)', explanation: 'Two iterative finds retain a fixed number of node references. Playback clones and snapshots are excluded.' },
      terms: [
        { symbol: 'n', meaning: `Number of members in the forest; currently ${size} entries.` },
        { symbol: 'alpha(n)', meaning: 'Inverse Ackermann growth in the amortized union-find sequence bound; it is not a per-operation worst-case guarantee.' },
        { symbol: 'O(1)', meaning: 'Constant work or additional storage, independent of the input size.' },
        { symbol: 'O(alpha(n))', meaning: 'Amortized inverse-Ackermann growth over a sequence of ranked union and compressed find operations.' },
        { symbol: 'O(n log n)', meaning: 'At most logarithmically many parent steps with linear-cost Map access per step.' },
      ],
    }
  }

  constructor(model: LinearModel, input: LinearInputValues = { first: 20, second: 80 }) {
    super(model, new DisjointSetLayout(), 'connected', input, ConnectedAnimation.title, ConnectedAnimation.summary)
  }
}
