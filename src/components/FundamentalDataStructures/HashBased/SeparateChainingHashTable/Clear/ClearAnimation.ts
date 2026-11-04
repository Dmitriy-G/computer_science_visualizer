import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import type { LinearModel, LinearInputValues } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { SeparateChainingHashTableLayout } from '../SeparateChainingHashTableLayout.ts'

export class ClearAnimation extends LinearAnimation {
  public static readonly title = 'Clear'
  public static readonly summary = 'Remove all stored entries according to this structure\'s allocation policy.'

  public static describe(size: number): AlgorithmInformation {
    return {
      name: this.title, summary: this.summary,
      time: { best: 'O(n + b)', average: 'O(n + b)', worst: 'O(n + b)', explanation: 'Visit every bucket and unlink all n actual linked nodes. Retained empty buckets are still inspected.' },
      memory: { best: 'O(1)', average: 'O(1)', worst: 'O(1)', explanation: 'Only a fixed number of references and counters are used. Existing storage, trace recording, and playback snapshots are excluded.' },
      terms: [
        { symbol: 'n', meaning: `Original entry count for this run: n = ${size}.` },
        { symbol: 'b', meaning: 'Number of allocated bucket heads; resizing doubles this count.' },
        { symbol: 'O(n + b)', meaning: 'Work or storage proportional to entries plus allocated buckets or slots.' },
        { symbol: 'O(1)', meaning: 'Constant work or additional storage under the stated assumptions.' },
      ],
    }
  }

  constructor(model: LinearModel, input: LinearInputValues = {}) {
    super(model, new SeparateChainingHashTableLayout(), 'clear', input, ClearAnimation.title, ClearAnimation.summary)
  }
}
