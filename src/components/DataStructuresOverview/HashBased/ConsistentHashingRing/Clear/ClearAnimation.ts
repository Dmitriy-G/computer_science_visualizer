import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import type { LinearModel, LinearInputValues } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { ConsistentHashingRingLayout } from '../ConsistentHashingRingLayout.ts'

export class ClearAnimation extends LinearAnimation {
  public static readonly title = 'Clear ring'
  public static readonly summary = 'Remove all physical servers and virtual tokens.'

  public static describe(size: number): AlgorithmInformation {
    return {
      name: this.title, summary: this.summary,
      time: { best: 'O(1)', average: 'O(1)', worst: 'O(1)', explanation: 'Replace the server registry and token array with empty ones. Deferred garbage collection of unreachable old storage is excluded.' },
      memory: { best: 'O(1)', average: 'O(1)', worst: 'O(1)', explanation: 'Only a fixed number of references and counters are used. Existing storage, trace recording, and playback snapshots are excluded.' },
      terms: [
        { symbol: 'O(1)', meaning: 'Constant work or additional storage under the stated assumptions.' },
      ],
    }
  }

  constructor(model: LinearModel, input: LinearInputValues = {}) {
    super(model, new ConsistentHashingRingLayout(), 'clear', input, ClearAnimation.title, ClearAnimation.summary)
  }
}
