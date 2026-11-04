import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import type { LinearModel, LinearInputValues } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { ChecksummedBlockTreeLayout } from '../ChecksummedBlockTreeLayout.ts'

export class CorruptAnimation extends LinearAnimation {
  public static readonly title = 'Simulate data corruption'
  public static readonly summary = 'Change a payload without repairing expected pointer checksums.'

  public static describe(size: number): AlgorithmInformation {
    return {
      name: this.title,
      summary: this.summary,
      time: { best: 'O(n)', average: 'O(n)', worst: 'O(n)', explanation: 'Scans leaf positions through the balanced hierarchy, then changes only one payload. A matching replacement value is not corruption. Rows are upper bounds for this teaching variant; empty or early-return cases can finish sooner.' },
      memory: { best: 'O(log(n + 1))', average: 'O(log(n + 1))', worst: 'O(log(n + 1))', explanation: 'Includes working collections and output required by this operation. Playback clones, recorded trace frames, and scene snapshots are excluded.' },
      terms: [
        { symbol: 'n', meaning: `Logical entries before the operation; currently ${size}.` },
        { symbol: 'O(n)', meaning: 'Linear work or storage in the logical entry count.' },
        { symbol: 'O(log(n + 1))', meaning: 'Logarithmic growth in entry count, with empty and singleton boundaries handled separately.' },
      ],
    }
  }

  constructor(model: LinearModel, input: LinearInputValues = { index: 0, value: 999 }) {
    super(model, new ChecksummedBlockTreeLayout(), 'corrupt-block', input, CorruptAnimation.title, CorruptAnimation.summary)
  }
}
