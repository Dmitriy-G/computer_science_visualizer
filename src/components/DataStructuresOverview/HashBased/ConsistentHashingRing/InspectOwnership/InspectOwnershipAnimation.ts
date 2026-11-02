import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import type { LinearModel, LinearInputValues } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { ConsistentHashingRingLayout } from '../ConsistentHashingRingLayout.ts'

export class InspectOwnershipAnimation extends LinearAnimation {
  public static readonly title = 'Inspect sample ownership'
  public static readonly summary = 'Route ten sample keys and show their current server assignments.'

  public static describe(size: number): AlgorithmInformation {
    return {
      name: this.title, summary: this.summary,
      time: { best: 'O(log n)', average: 'O(log n)', worst: 'O(log n)', explanation: 'Binary lower-bound search locates the first clockwise token among 3n sorted tokens, then wraps if needed. No early equality exit is used. Sample inspection performs this for exactly ten fixed keys. Empty rings finish in O(1); bounds hold without randomness assumptions.' },
      memory: { best: 'O(1)', average: 'O(1)', worst: 'O(1)', explanation: 'Binary search uses fixed counters. The sample inspection returns at most ten owners, a fixed-size output independent of n. Playback storage is excluded.' },
      terms: [
        { symbol: 'n', meaning: `Original physical server count for this run: n = ${size}; each server has three tokens.` },
        { symbol: 'O(log n)', meaning: 'Work proportional to the logarithm of the server count.' },
        { symbol: 'O(1)', meaning: 'Constant work or additional storage under the stated assumptions.' },
      ],
    }
  }

  constructor(model: LinearModel, input: LinearInputValues = {}) {
    super(model, new ConsistentHashingRingLayout(), 'inspect-storage', input, InspectOwnershipAnimation.title, InspectOwnershipAnimation.summary)
  }
}
