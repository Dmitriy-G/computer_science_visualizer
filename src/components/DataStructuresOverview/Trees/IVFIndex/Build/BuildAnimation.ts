import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import type { LinearModel, LinearInputValues } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { IVFIndexLayout } from '../IVFIndexLayout.ts'

export class BuildAnimation extends LinearAnimation {
  public static readonly title = 'Train and build'
  public static readonly summary = 'Train coarse centroids and assign vectors to actual inverted lists.'

  public static describe(size: number): AlgorithmInformation {
    return {
      name: this.title,
      summary: this.summary,
      time: { best: 'O(n)', average: 'O(n)', worst: 'O(n)', explanation: 'Run eight Lloyd iterations over n replacement vectors with at most eight centroids in fixed dimension two. Seeding uses distinct input points; empty centroids retain their prior location. The fixed iteration, cluster, and coordinate bounds make training linear in n. Rows state upper bounds; empty, rejected, and early-return cases may finish sooner.' },
      memory: { best: 'O(n)', average: 'O(n)', worst: 'O(n)', explanation: 'Includes operation working storage and returned output. Build includes the replacement representation. Playback clones, trace snapshots, and scene storage are excluded. Empty operations can use constant storage.' },
      terms: [
        { symbol: 'n', meaning: `Replacement input record count for Build; the previously committed structure contains ${size} records.` },
        { symbol: 'O(n)', meaning: 'The stated growth bound for this bounded representation.' },
      ],
    }
  }

  constructor(model: LinearModel, input: LinearInputValues = {}) {
    super(model, new IVFIndexLayout(), 'build-values', input, BuildAnimation.title, BuildAnimation.summary)
  }
}
