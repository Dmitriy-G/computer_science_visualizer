import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import type { LinearModel, LinearInputValues } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { SuffixArrayLayout } from '../SuffixArrayLayout.ts'

export class BuildAnimation extends LinearAnimation {
  public static readonly title = 'Build from text'
  public static readonly summary = 'Merge-sort suffix positions and compute adjacent common-prefix lengths.'

  public static describe(size: number): AlgorithmInformation {
    return {
      name: this.title,
      summary: this.summary,
      time: { best: 'O(n log n)', average: 'O(n² log n)', worst: 'O(n² log n)', explanation: 'Bottom-up merge sort makes O(n log n) comparisons; each may read O(n) characters. Direct adjacent LCP scans add O(n²). No random-text assumption is made, so the average uses a conservative upper bound; this is not linear-time construction. Playback cloning, scene snapshots, and display formatting are excluded.' },
      memory: { best: 'O(n)', average: 'O(n)', worst: 'O(n)', explanation: 'Store the source, suffix positions, LCP values, and a temporary merge array. Playback cloning, scene snapshots, and display formatting are excluded.' },
      terms: [
        { symbol: 'n', meaning: `Source length for this operation (including the terminator for suffix-array/FM rows). The committed source currently has ${size} characters; build bounds use replacement input size.` },
      ],
    }
  }

  constructor(model: LinearModel, input: LinearInputValues = {}) {
    super(model, new SuffixArrayLayout(), 'build-text', input, BuildAnimation.title, BuildAnimation.summary)
  }
}
