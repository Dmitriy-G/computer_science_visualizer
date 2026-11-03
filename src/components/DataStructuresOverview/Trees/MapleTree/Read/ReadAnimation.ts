import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import type { LinearModel, LinearInputValues } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { MapleTreeLayout } from '../MapleTreeLayout.ts'

export class ReadAnimation extends LinearAnimation {
  public static readonly title = 'Read at index'
  public static readonly summary = 'Follow inclusive child pivots to a range value or gap.'

  public static describe(size: number): AlgorithmInformation {
    return {
      name: this.title,
      summary: this.summary,
      time: { best: 'O(log(n + 1))', average: 'O(log(n + 1))', worst: 'O(log(n + 1))', explanation: 'Fixed fanout bounds each page scan and balanced levels give logarithmic lookup depth. Rows are upper bounds for this teaching variant; empty or early-return cases can finish sooner.' },
      memory: { best: 'O(1)', average: 'O(1)', worst: 'O(1)', explanation: 'Includes working collections and output required by this operation. Playback clones, recorded trace frames, and scene snapshots are excluded.' },
      terms: [
        { symbol: 'n', meaning: `Logical entries before the operation; currently ${size}.` },
        { symbol: 'O(log(n + 1))', meaning: 'Logarithmic growth in entry count, with empty and singleton boundaries handled separately.' },
        { symbol: 'O(1)', meaning: 'Constant work or storage under the stated fixed word, universe, or capacity bounds.' },
      ],
    }
  }

  constructor(model: LinearModel, input: LinearInputValues = { index: 0 }) {
    super(model, new MapleTreeLayout(), 'search-index', input, ReadAnimation.title, ReadAnimation.summary)
  }
}
