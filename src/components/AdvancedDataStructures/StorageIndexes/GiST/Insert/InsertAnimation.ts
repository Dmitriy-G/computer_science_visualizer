import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import type { LinearModel, LinearInputValues } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { GiSTLayout } from '../GiSTLayout.ts'

export class InsertAnimation extends LinearAnimation {
  public static readonly title = 'Insert an interval'
  public static readonly summary = 'Descend by penalty and split overflowing pages.'

  public static describe(size: number): AlgorithmInformation {
    return {
      name: this.title,
      summary: this.summary,
      time: { best: 'O(log(n + 1))', average: 'O(log(n + 1))', worst: 'O(log(n + 1))', explanation: 'Fixed-capacity balanced pages give logarithmic descent and possible cascading splits. An insertion-only upper bound is shown for every input distribution. Rows are upper bounds for this teaching variant; empty or early-return cases can finish sooner.' },
      memory: { best: 'O(log(n + 1))', average: 'O(log(n + 1))', worst: 'O(log(n + 1))', explanation: 'Includes working collections and output required by this operation. Playback clones, recorded trace frames, and scene snapshots are excluded.' },
      terms: [
        { symbol: 'n', meaning: `Logical entries before the operation; currently ${size}.` },
        { symbol: 'O(log(n + 1))', meaning: 'Logarithmic growth in entry count, with empty and singleton boundaries handled separately.' },
      ],
    }
  }

  constructor(model: LinearModel, input: LinearInputValues = { minimum: 5, maximum: 16 }) {
    super(model, new GiSTLayout(), 'insert', input, InsertAnimation.title, InsertAnimation.summary)
  }
}
