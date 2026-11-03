import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import type { LinearModel, LinearInputValues } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { MapleTreeLayout } from '../MapleTreeLayout.ts'

export class EraseRangeAnimation extends LinearAnimation {
  public static readonly title = 'Erase a range'
  public static readonly summary = 'Remove an inclusive interval, splitting surrounding ranges if needed.'

  public static describe(size: number): AlgorithmInformation {
    return {
      name: this.title,
      summary: this.summary,
      time: { best: 'O(n log(n + 1))', average: 'O(n log(n + 1))', worst: 'O(n log(n + 1))', explanation: 'Scans all intervals and rebuilds sorted fragments and pivot pages. This teaching variant does not perform incremental Linux Maple repairs. Rows are upper bounds for this teaching variant; empty or early-return cases can finish sooner.' },
      memory: { best: 'O(n)', average: 'O(n)', worst: 'O(n)', explanation: 'Includes working collections and output required by this operation. Playback clones, recorded trace frames, and scene snapshots are excluded.' },
      terms: [
        { symbol: 'n', meaning: `Logical entries before the operation; currently ${size}.` },
        { symbol: 'O(n log(n + 1))', meaning: 'Linear entry count multiplied by a logarithmic factor, as in comparison sorting.' },
        { symbol: 'O(n)', meaning: 'Linear work or storage in the logical entry count.' },
      ],
    }
  }

  constructor(model: LinearModel, input: LinearInputValues = { minimum: 5, maximum: 25 }) {
    super(model, new MapleTreeLayout(), 'delete-value', input, EraseRangeAnimation.title, EraseRangeAnimation.summary)
  }
}
