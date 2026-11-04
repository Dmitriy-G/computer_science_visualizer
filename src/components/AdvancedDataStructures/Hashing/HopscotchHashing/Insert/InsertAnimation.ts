import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import type { LinearModel, LinearInputValues } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { HopscotchHashingLayout } from '../HopscotchHashingLayout.ts'

export class InsertAnimation extends LinearAnimation {
  public static readonly title = 'Insert / update'
  public static readonly summary = 'Keep each record within four positions of home and relocate a hole using home-owned bitmaps.'

  public static describe(size: number): AlgorithmInformation {
    return {
      name: this.title, summary: this.summary,
      time: { best: 'O(1)', average: 'O(nb)', worst: 'O(nb)', explanation: 'A free home-neighborhood slot is constant. Otherwise rollback snapshots, hole scans, hops, and bounded larger-table rebuilds execute. With neighborhood size fixed at four, a candidate rebuild may take O(nb). Average O(nb) is a conservative bound without assumptions about key distribution; impossible neighborhoods reject unchanged.' },
      memory: { best: 'O(1)', average: 'O(b)', worst: 'O(b)', explanation: 'Direct placement uses one record. Relocation rollback and candidate rebuilds hold O(b) slots and bitmaps; the bounded record list fits within that capacity. Trace and playback storage are excluded.' },
      terms: [
        { symbol: 'n', meaning: `Original entry count for this run: n = ${size}.` },
        { symbol: 'b', meaning: 'Largest slot capacity used in the operation, capped at 256.' },
        { symbol: 'O(1)', meaning: 'Constant work or additional storage under the stated assumptions.' },
        { symbol: 'O(nb)', meaning: 'A conservative upper bound proportional to records times slot capacity.' },
        { symbol: 'O(b)', meaning: 'Work or storage proportional to allocated or attempted slots/buckets.' },
      ],
    }
  }

  constructor(model: LinearModel, input: LinearInputValues = {}) {
    super(model, new HopscotchHashingLayout(), 'insert', input, InsertAnimation.title, InsertAnimation.summary)
  }
}
