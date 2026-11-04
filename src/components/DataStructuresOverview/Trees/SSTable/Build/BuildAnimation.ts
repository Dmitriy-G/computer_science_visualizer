import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import type { LinearModel, LinearInputValues } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { SSTableLayout } from '../SSTableLayout.ts'

export class BuildAnimation extends LinearAnimation {
  public static readonly title = 'Build sorted records'
  public static readonly summary = 'Replace the immutable sorted file and rebuild its index.'

  public static describe(size: number): AlgorithmInformation {
    return {
      name: this.title,
      summary: this.summary,
      time: { best: 'O(n log(n + 1))', average: 'O(n log(n + 1))', worst: 'O(n log(n + 1))', explanation: 'Parse and validate distinct keys, comparison-sort the replacement input, encode records, and build the index. Here n is the replacement input count, independent of the previous committed size. Rows state upper bounds; empty, rejected, and early-return cases may finish sooner.' },
      memory: { best: 'O(n)', average: 'O(n)', worst: 'O(n)', explanation: 'Includes operation working storage and returned output. Build includes the replacement representation. Playback clones, trace snapshots, and scene storage are excluded. Empty operations can use constant storage.' },
      terms: [
        { symbol: 'n', meaning: `Replacement input record count for Build; the previously committed structure contains ${size} records.` },
        { symbol: 'O(n log(n + 1))', meaning: 'The stated growth bound for this bounded representation.' },
        { symbol: 'O(n)', meaning: 'Additional working and output storage for the operation.' },
      ],
    }
  }

  constructor(model: LinearModel, input: LinearInputValues = {}) {
    super(model, new SSTableLayout(), 'build-values', input, BuildAnimation.title, BuildAnimation.summary)
  }
}
