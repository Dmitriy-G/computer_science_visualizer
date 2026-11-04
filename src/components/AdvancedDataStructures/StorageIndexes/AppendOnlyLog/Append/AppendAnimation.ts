import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import type { LinearModel, LinearInputValues } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { AppendOnlyLogLayout } from '../AppendOnlyLogLayout.ts'

export class AppendAnimation extends LinearAnimation {
  public static readonly title = 'Append a record'
  public static readonly summary = 'Append a value at the next monotone offset.'

  public static describe(size: number): AlgorithmInformation {
    return {
      name: this.title,
      summary: this.summary,
      time: { best: 'O(n)', average: 'O(n)', worst: 'O(n)', explanation: 'A segment holds at most four records. Append normally takes amortized constant work; the conservative linear bound includes possible JavaScript Map growth when adding a segment. Existing records are retained. Rows are upper bounds for this teaching variant; empty or early-return cases can finish sooner.' },
      memory: { best: 'O(n)', average: 'O(n)', worst: 'O(n)', explanation: 'Includes working collections and output required by this operation. Playback clones, recorded trace frames, and scene snapshots are excluded.' },
      terms: [
        { symbol: 'n', meaning: `Logical entries before the operation; currently ${size}.` },
        { symbol: 'O(n)', meaning: 'Linear work or storage in the logical entry count.' },
      ],
    }
  }

  constructor(model: LinearModel, input: LinearInputValues = { value: 99 }) {
    super(model, new AppendOnlyLogLayout(), 'insert-end', input, AppendAnimation.title, AppendAnimation.summary)
  }
}
