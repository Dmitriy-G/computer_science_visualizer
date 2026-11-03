import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import type { LinearModel, LinearInputValues } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { MapleTreeLayout } from '../MapleTreeLayout.ts'

export class StoreRangeAnimation extends LinearAnimation {
  public static readonly title = 'Store a range'
  public static readonly summary = 'Replace an inclusive interval and preserve outside fragments.'

  public static describe(size: number): AlgorithmInformation {
    return {
      name: this.title,
      summary: this.summary,
      time: { best: 'O(n log(n + 1))', average: 'O(n log(n + 1))', worst: 'O(n log(n + 1))', explanation: 'Scans existing intervals, sorts resulting fragments, and rebuilds fanout-four pages. The bounds include the retained output and conservative sorting work. Rows are upper bounds for this teaching variant; empty or early-return cases can finish sooner.' },
      memory: { best: 'O(n)', average: 'O(n)', worst: 'O(n)', explanation: 'Includes working collections and output required by this operation. Playback clones, recorded trace frames, and scene snapshots are excluded.' },
      terms: [
        { symbol: 'n', meaning: `Logical entries before the operation; currently ${size}.` },
        { symbol: 'O(n log(n + 1))', meaning: 'Linear entry count multiplied by a logarithmic factor, as in comparison sorting.' },
        { symbol: 'O(n)', meaning: 'Linear work or storage in the logical entry count.' },
      ],
    }
  }

  constructor(model: LinearModel, input: LinearInputValues = { minimum: 5, maximum: 25, value: 99 }) {
    super(model, new MapleTreeLayout(), 'insert', input, StoreRangeAnimation.title, StoreRangeAnimation.summary)
  }
}
