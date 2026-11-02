import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import type { LinearModel, LinearInputValues } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { CuckooFilterLayout } from '../CuckooFilterLayout.ts'

export class AddAnimation extends LinearAnimation {
  public static readonly title = 'Add a value'
  public static readonly summary = 'Find a path to an empty fingerprint slot, then relocate residents backward along it.'

  public static describe(size: number): AlgorithmInformation {
    return {
      name: this.title,
      summary: this.summary,
      time: { best: 'O(1)', average: 'O(bs)', worst: 'O(bs + n)', explanation: 'This deterministic BFS relocation variant visits each bucket at most once, scanning s slots. It plans before mutation, so failure preserves storage. The extra deletion ledger has expected constant access and linear worst case; no expected constant insertion claim is made. Animation snapshots and renderer work are excluded.' },
      memory: { best: 'O(1)', average: 'O(b)', worst: 'O(b)', explanation: 'An immediate hole requires only the two root buckets. Otherwise a bucket queue and parent map store a relocation path. Persistent storage is bs fingerprints plus an O(n) exact deletion guard. Animation snapshots and renderer work are excluded.' },
      terms: [
        { symbol: 'n', meaning: `Live fingerprint occurrences before this run: ${size}. The extra deletion ledger stores at most n distinct keys.` },
        { symbol: 'b', meaning: 'Eight allocated cuckoo fingerprint buckets.' },
        { symbol: 's', meaning: 'Two fingerprint slots per cuckoo bucket.' },
        { symbol: 'O(1)', meaning: 'Constant additional work or storage in the stated operation model.' },
      ],
    }
  }

  constructor(model: LinearModel, input: LinearInputValues = {}) {
    super(model, new CuckooFilterLayout(), 'insert', input, AddAnimation.title, AddAnimation.summary)
  }
}
