import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import type { LinearModel, LinearInputValues } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { ContentAddressedLayersLayout } from '../ContentAddressedLayersLayout.ts'

export class LookupContentAnimation extends LinearAnimation {
  public static readonly title = 'Look up content'
  public static readonly summary = 'Hash a payload and look up its shared content blob.'

  public static describe(size: number): AlgorithmInformation {
    return {
      name: this.title,
      summary: this.summary,
      time: { best: 'O(1)', average: 'O(1)', worst: 'O(n)', explanation: 'Compute one fixed-size payload digest and query the content map. Assumes average constant-time map access; conservative worst-case map access is linear. Rows state upper bounds; empty, rejected, and early-return cases may finish sooner.' },
      memory: { best: 'O(1)', average: 'O(1)', worst: 'O(1)', explanation: 'Includes operation working storage and returned output. Playback clones, trace snapshots, and scene storage are excluded. Empty operations can use constant storage.' },
      terms: [
        { symbol: 'n', meaning: `Logical entries before the operation; currently ${size}.` },
        { symbol: 'O(1)', meaning: 'Constant work under average constant-time map access.' },
        { symbol: 'O(n)', meaning: 'Conservative linear worst-case map lookup cost.' },
      ],
    }
  }

  constructor(model: LinearModel, input: LinearInputValues = {}) {
    super(model, new ContentAddressedLayersLayout(), 'search-value', input, LookupContentAnimation.title, LookupContentAnimation.summary)
  }
}
