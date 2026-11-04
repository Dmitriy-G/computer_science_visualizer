import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import type { LinearModel, LinearInputValues } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { ContentAddressedLayersLayout } from '../ContentAddressedLayersLayout.ts'

export class ReadChainAnimation extends LinearAnimation {
  public static readonly title = 'Read a layer chain'
  public static readonly summary = 'Follow parent ChainIDs from one layer to its root.'

  public static describe(size: number): AlgorithmInformation {
    return {
      name: this.title,
      summary: this.summary,
      time: { best: 'O(n)', average: 'O(n)', worst: 'O(n?)', explanation: 'Follow at most n immutable parent references and retain the returned path. Assumes average constant-time map access. The average bound assumes constant-time map access; conservative linear worst-case map access can make total work quadratic. Rows state upper bounds; empty, rejected, and early-return cases may finish sooner.' },
      memory: { best: 'O(n)', average: 'O(n)', worst: 'O(n)', explanation: 'Includes operation working storage and returned output. Playback clones, trace snapshots, and scene storage are excluded. Empty operations can use constant storage.' },
      terms: [
        { symbol: 'n', meaning: `Logical entries before the operation; currently ${size}.` },
        { symbol: 'O(n)', meaning: 'Linear work under average constant-time map access.' },
        { symbol: 'O(n?)', meaning: 'Quadratic upper bound with linear worst-case map access.' },
      ],
    }
  }

  constructor(model: LinearModel, input: LinearInputValues = {}) {
    super(model, new ContentAddressedLayersLayout(), 'browse-node', input, ReadChainAnimation.title, ReadChainAnimation.summary)
  }
}
