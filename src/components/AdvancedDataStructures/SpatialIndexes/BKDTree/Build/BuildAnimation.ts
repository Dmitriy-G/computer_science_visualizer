import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import type { LinearModel, LinearInputValues } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { BKDTreeLayout } from '../BKDTreeLayout.ts'

export class BuildAnimation extends LinearAnimation {
  public static readonly title = 'Build from points'
  public static readonly summary = 'Bulk-build the hierarchy from 1 to 64 coordinate pairs.'

  public static describe(size: number): AlgorithmInformation {
    return {
      name: this.title,
      summary: this.summary,
      time: { best: 'O(n log² n)', average: 'O(n log² n)', worst: 'O(n log² n)', explanation: 'Median construction sorts each recursive partition and retains balanced nodes. These are upper bounds for every point distribution; empty reset is constant time. The input n is the number of supplied points. Rows are upper bounds for this teaching variant; empty or early-return cases can finish sooner.' },
      memory: { best: 'O(n)', average: 'O(n)', worst: 'O(n)', explanation: 'Includes working collections and output required by this operation. Playback clones, recorded trace frames, and scene snapshots are excluded.' },
      terms: [
        { symbol: 'n', meaning: `Number of points supplied in the build dialog. The current index contains ${size} points before replacement.` },
        { symbol: 'O(n log² n)', meaning: 'Linear entry count multiplied by two logarithmic factors, as in recursively sorting partitions.' },
        { symbol: 'O(n)', meaning: 'Linear work or storage in the logical entry count.' },
      ],
    }
  }

  constructor(model: LinearModel, input: LinearInputValues = { text: '1:2, 5:6, 9:3' }) {
    super(model, new BKDTreeLayout(), 'build-values', input, BuildAnimation.title, BuildAnimation.summary)
  }
}
