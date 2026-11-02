import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import type { LinearModel, LinearInputValues } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { OpenAddressingHashTableLayout } from '../OpenAddressingHashTableLayout.ts'

export class ClearAnimation extends LinearAnimation {
  public static readonly title = 'Clear'
  public static readonly summary = 'Remove all stored entries according to this structure\'s allocation policy.'

  public static describe(size: number): AlgorithmInformation {
    return {
      name: this.title, summary: this.summary,
      time: { best: 'O(b)', average: 'O(b)', worst: 'O(b)', explanation: 'Inspect every physical slot, release occupied records, and remove tombstones while retaining capacity; even an empty table with retained storage scans b slots.' },
      memory: { best: 'O(1)', average: 'O(1)', worst: 'O(1)', explanation: 'Only a fixed number of references and counters are used. Existing storage, trace recording, and playback snapshots are excluded.' },
      terms: [
        { symbol: 'b', meaning: 'Number of physical slots (or slots in a larger table during rehash).' },
        { symbol: 'O(b)', meaning: 'Work or storage proportional to allocated or attempted slots/buckets.' },
        { symbol: 'O(1)', meaning: 'Constant work or additional storage under the stated assumptions.' },
      ],
    }
  }

  constructor(model: LinearModel, input: LinearInputValues = {}) {
    super(model, new OpenAddressingHashTableLayout(), 'clear', input, ClearAnimation.title, ClearAnimation.summary)
  }
}
