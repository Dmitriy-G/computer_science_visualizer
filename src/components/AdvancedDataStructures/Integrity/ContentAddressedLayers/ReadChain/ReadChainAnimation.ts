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
      time: { best: 'O(1)', average: 'O(n)', worst: 'O(n²)', explanation: 'A root-layer lookup returns a one-element path. A chain can contain n references; average O(n) is an upper bound with expected constant Map access, not a depth-distribution claim. Allowing linear worst-case Map access gives O(n²) for a full chain.' },
      memory: { best: 'O(1)', average: 'O(n)', worst: 'O(n)', explanation: 'Return one ID for a root layer, or up to n IDs for a full ancestor chain. Average is an upper bound without a depth distribution. Playback clones and snapshots are excluded.' },
      terms: [
        { symbol: 'O(1)', meaning: 'Constant work or storage for a root-layer result.' },
        { symbol: 'n', meaning: `Logical entries before the operation; currently ${size}.` },
        { symbol: 'O(n)', meaning: 'Linear work under average constant-time map access.' },
        { symbol: 'O(n²)', meaning: 'Quadratic upper bound with linear worst-case map access.' },
      ],
    }
  }

  constructor(model: LinearModel, input: LinearInputValues = {}) {
    super(model, new ContentAddressedLayersLayout(), 'browse-node', input, ReadChainAnimation.title, ReadChainAnimation.summary)
  }
}
