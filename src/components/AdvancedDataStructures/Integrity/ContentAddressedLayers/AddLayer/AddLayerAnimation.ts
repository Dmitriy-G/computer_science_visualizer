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
      time: { best: 'O(1)', average: 'O(1)', worst: 'O(n)', explanation: 'Hash bounded integer payload bytes and a bounded pair of SHA-256 identifiers; perform a fixed number of map operations. The average row assumes expected amortized Map insertion; a Map lookup or resize can require linear work in the conservative worst case. Rows state upper bounds; empty, rejected, and early-return cases may finish sooner.' },
      memory: { best: 'O(1)', average: 'O(1)', worst: 'O(n)', explanation: 'A new reference and optional blob use constant new storage without Map growth. Average allocation is amortized across insertions; a Map resize can allocate O(n) slots. Reusing an existing layer needs constant space. Playback clones and snapshots are excluded.' },
      terms: [
        { symbol: 'n', meaning: `Logical entries before the operation; currently ${size}.` },
        { symbol: 'O(1)', meaning: 'Constant work under average constant-time map access.' },
        { symbol: 'O(n)', meaning: 'Conservative linear worst-case Map lookup, growth, or allocation cost.' },
      ],
    }
  }

  constructor(model: LinearModel, input: LinearInputValues = {}) {
    super(model, new ContentAddressedLayersLayout(), 'insert', input, AddLayerAnimation.title, AddLayerAnimation.summary)
  }
}
