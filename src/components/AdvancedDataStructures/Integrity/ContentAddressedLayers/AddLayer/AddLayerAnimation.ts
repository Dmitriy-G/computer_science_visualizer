import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import type { LinearModel, LinearInputValues } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { ContentAddressedLayersLayout } from '../ContentAddressedLayersLayout.ts'

export class AddLayerAnimation extends LinearAnimation {
  public static readonly title = 'Add a layer'
  public static readonly summary = 'Hash its content, share the blob, and publish its parent-chain identity.'

  public static describe(size: number): AlgorithmInformation {
    return {
      name: this.title,
      summary: this.summary,
      time: { best: 'O(1)', average: 'O(1)', worst: 'O(n)', explanation: 'Hash bounded integer payload bytes and a bounded pair of SHA-256 identifiers; perform a fixed number of map operations. Bounds assume average constant-time map access, with linear worst-case map access. Rows state upper bounds; empty, rejected, and early-return cases may finish sooner.' },
      memory: { best: 'O(1)', average: 'O(1)', worst: 'O(1)', explanation: 'Includes operation working storage and returned output. Playback clones, trace snapshots, and scene storage are excluded. Empty operations can use constant storage.' },
      terms: [
        { symbol: 'n', meaning: `Logical entries before the operation; currently ${size}.` },
        { symbol: 'O(1)', meaning: 'Constant work under average constant-time map access.' },
        { symbol: 'O(n)', meaning: 'Conservative linear worst-case map lookup cost.' },
      ],
    }
  }

  constructor(model: LinearModel, input: LinearInputValues = {}) {
    super(model, new ContentAddressedLayersLayout(), 'insert', input, AddLayerAnimation.title, AddLayerAnimation.summary)
  }
}
