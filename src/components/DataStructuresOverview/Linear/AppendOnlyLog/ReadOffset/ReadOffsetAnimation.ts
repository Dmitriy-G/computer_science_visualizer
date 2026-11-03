import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import type { LinearModel, LinearInputValues } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { AppendOnlyLogLayout } from '../AppendOnlyLogLayout.ts'

export class ReadOffsetAnimation extends LinearAnimation {
  public static readonly title = 'Read by offset'
  public static readonly summary = 'Read a retained offset without consuming its record.'

  public static describe(size: number): AlgorithmInformation {
    return {
      name: this.title,
      summary: this.summary,
      time: { best: 'O(1)', average: 'O(1)', worst: 'O(n)', explanation: 'The offset selects a segment, then at most four records are checked. Lookup assumes expected constant-time Map operations; the worst row allows hash-table collisions. Rows are upper bounds for this teaching variant; empty or early-return cases can finish sooner.' },
      memory: { best: 'O(1)', average: 'O(1)', worst: 'O(1)', explanation: 'Includes working collections and output required by this operation. Playback clones, recorded trace frames, and scene snapshots are excluded.' },
      terms: [
        { symbol: 'n', meaning: `Retained log records before this read; currently ${size}.` },
        { symbol: 'O(1)', meaning: 'A fixed amount of work or storage under the stated universe, word, and capacity bounds.' },
        { symbol: 'O(n)', meaning: 'Linear work or storage in the logical entry count.' },
      ],
    }
  }

  constructor(model: LinearModel, input: LinearInputValues = { index: 0 }) {
    super(model, new AppendOnlyLogLayout(), 'search-index', input, ReadOffsetAnimation.title, ReadOffsetAnimation.summary)
  }
}
