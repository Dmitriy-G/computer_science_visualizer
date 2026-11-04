import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import type { LinearModel, LinearInputValues } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { ConsistentHashingRingLayout } from '../ConsistentHashingRingLayout.ts'

export class RemoveServerAnimation extends LinearAnimation {
  public static readonly title = 'Remove a server'
  public static readonly summary = 'Remove its tokens; only keys owned by that server change owner.'

  public static describe(size: number): AlgorithmInformation {
    return {
      name: this.title, summary: this.summary,
      time: { best: 'O(1)', average: 'O(n)', worst: 'O(n)', explanation: 'A missing server is rejected in constant expected registry time. Successful removal filters all 3n tokens, keeping other servers\' positions unchanged. Average assumes a uniformly chosen existing server.' },
      memory: { best: 'O(1)', average: 'O(n)', worst: 'O(n)', explanation: 'A successful removal allocates the retained token array in O(n) storage; a miss allocates no replacement array. Sample arrays have a fixed size of ten. Playback snapshots are excluded.' },
      terms: [
        { symbol: 'n', meaning: `Original physical server count for this run: n = ${size}; each server has three tokens.` },
        { symbol: 'O(1)', meaning: 'Constant work or additional storage under the stated assumptions.' },
        { symbol: 'O(n)', meaning: 'Work or storage proportional to original entries (or servers for the ring).' },
      ],
    }
  }

  constructor(model: LinearModel, input: LinearInputValues = {}) {
    super(model, new ConsistentHashingRingLayout(), 'delete-value', input, RemoveServerAnimation.title, RemoveServerAnimation.summary)
  }
}
