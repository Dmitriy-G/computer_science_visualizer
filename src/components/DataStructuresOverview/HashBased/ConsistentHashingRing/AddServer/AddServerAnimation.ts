import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import type { LinearModel, LinearInputValues } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { ConsistentHashingRingLayout } from '../ConsistentHashingRingLayout.ts'

export class AddServerAnimation extends LinearAnimation {
  public static readonly title = 'Add a server'
  public static readonly summary = 'Insert three virtual tokens and transfer only their predecessor intervals to the new server.'

  public static describe(size: number): AlgorithmInformation {
    return {
      name: this.title, summary: this.summary,
      time: { best: 'O(1)', average: 'O(n)', worst: 'O(n)', explanation: 'An existing server ID is rejected in constant expected registry time. A new server inserts three tokens into a sorted array with linear scans/shifts. Average assumes successful membership changes; token hashing is deterministic.' },
      memory: { best: 'O(1)', average: 'O(1)', worst: 'O(n)', explanation: 'Three new tokens plus fixed-size before/after sample arrays. Additional array allocation is amortized O(1) over insertion-only sequences; one host-array growth can require O(n). Playback snapshots are excluded.' },
      terms: [
        { symbol: 'n', meaning: `Original physical server count for this run: n = ${size}; each server has three tokens.` },
        { symbol: 'O(1)', meaning: 'Constant work or additional storage under the stated assumptions.' },
        { symbol: 'O(n)', meaning: 'Work or storage proportional to original entries (or servers for the ring).' },
      ],
    }
  }

  constructor(model: LinearModel, input: LinearInputValues = {}) {
    super(model, new ConsistentHashingRingLayout(), 'insert', input, AddServerAnimation.title, AddServerAnimation.summary)
  }
}
