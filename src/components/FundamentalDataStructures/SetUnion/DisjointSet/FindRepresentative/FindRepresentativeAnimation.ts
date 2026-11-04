import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import type { LinearModel, LinearInputValues } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { DisjointSetLayout } from '../DisjointSetLayout.ts'

export class FindRepresentativeAnimation extends LinearAnimation {
  public static readonly title = 'Find representative'
  public static readonly summary = 'Follow parent pointers and compress every visited node directly to its root.'

  public static describe(size: number): AlgorithmInformation {
    return {
      name: this.title,
      summary: this.summary,
      time: { best: 'O(1)', average: 'O(alpha(n))', worst: 'O(n log n)', explanation: 'A root takes constant parent work. The average row is an amortized bound over operation sequences with ranked union and path compression, assuming expected constant Map access. A single find has at most logarithmic parent depth; conservative worst time includes linear-cost Map access at each step. Playback clones, traces, and scene formatting are excluded.' },
      memory: { best: 'O(1)', average: 'O(1)', worst: 'O(1)', explanation: 'Two iterative passes use a fixed number of node references; no path array is allocated. Playback clones and snapshots are excluded.' },
      terms: [
        { symbol: 'n', meaning: `Number of members in the forest; currently ${size} entries.` },
        { symbol: 'alpha(n)', meaning: 'Inverse Ackermann growth in the amortized union-find sequence bound; it is not a per-operation worst-case guarantee.' },
        { symbol: 'O(1)', meaning: 'Constant work or additional storage, independent of the input size.' },
        { symbol: 'O(alpha(n))', meaning: 'Amortized inverse-Ackermann growth over a sequence of ranked union and compressed find operations.' },
        { symbol: 'O(n log n)', meaning: 'At most logarithmically many parent steps with linear-cost Map access per step.' },
      ],
    }
  }

  constructor(model: LinearModel, input: LinearInputValues = { value: 80 }) {
    super(model, new DisjointSetLayout(), 'find-set', input, FindRepresentativeAnimation.title, FindRepresentativeAnimation.summary)
  }
}
