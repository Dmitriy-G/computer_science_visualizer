import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import type { LinearModel, LinearInputValues } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { ContentAddressedLayersLayout } from '../ContentAddressedLayersLayout.ts'

export class ClearAnimation extends LinearAnimation {
  public static readonly title = 'Clear'
  public static readonly summary = 'Release descendant references before parents and reclaim unused content.'

  public static describe(size: number): AlgorithmInformation {
    return {
      name: this.title,
      summary: this.summary,
      time: { best: 'O(n²)', average: 'O(n²)', worst: 'O(n²)', explanation: 'After each of n releases, scan every surviving reference to check blob ownership. The scans total n(n - 1)/2 regardless of sharing, so all cases are quadratic. Linear worst-case Map operations do not increase this bound. Empty storage takes O(1).' },
      memory: { best: 'O(n)', average: 'O(n)', worst: 'O(n)', explanation: 'The reversed release-order array holds n layer references. Ownership checks use only local variables. Existing blobs, playback clones, and snapshots are excluded; empty storage needs O(1).' },
      terms: [
        { symbol: 'n', meaning: `Logical entries before the operation; currently ${size}.` },
        { symbol: 'O(n²)', meaning: 'Quadratic work from scanning surviving references after every release.' },
        { symbol: 'O(n)', meaning: 'Additional working and output storage for the operation.' },
      ],
    }
  }

  constructor(model: LinearModel, input: LinearInputValues = {}) {
    super(model, new ContentAddressedLayersLayout(), 'clear', input, ClearAnimation.title, ClearAnimation.summary)
  }
}
