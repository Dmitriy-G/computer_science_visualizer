import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import type { LinearModel, LinearInputValues } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { ChecksummedBlockTreeLayout } from '../ChecksummedBlockTreeLayout.ts'

export class UpdateAnimation extends LinearAnimation {
  public static readonly title = 'Update a data block'
  public static readonly summary = 'Copy a leaf and its ancestor path with new pointer checksums.'

  public static describe(size: number): AlgorithmInformation {
    return {
      name: this.title,
      summary: this.summary,
      time: { best: 'O(n)', average: 'O(n)', worst: 'O(n)', explanation: 'This implementation scans leaf positions to locate the indexed block and hashes the copied fixed-fanout path. Ten data blocks are fixed; the generalized bound allows a linear locator scan. Rows are upper bounds for this teaching variant; empty or early-return cases can finish sooner.' },
      memory: { best: 'O(log(n + 1))', average: 'O(log(n + 1))', worst: 'O(log(n + 1))', explanation: 'Includes working collections and output required by this operation. Playback clones, recorded trace frames, and scene snapshots are excluded.' },
      terms: [
        { symbol: 'n', meaning: `Logical entries before the operation; currently ${size}.` },
        { symbol: 'O(n)', meaning: 'Linear work or storage in the logical entry count.' },
        { symbol: 'O(log(n + 1))', meaning: 'Logarithmic growth in entry count, with empty and singleton boundaries handled separately.' },
      ],
    }
  }

  constructor(model: LinearModel, input: LinearInputValues = { index: 0, value: 99 }) {
    super(model, new ChecksummedBlockTreeLayout(), 'update-index', input, UpdateAnimation.title, UpdateAnimation.summary)
  }
}
