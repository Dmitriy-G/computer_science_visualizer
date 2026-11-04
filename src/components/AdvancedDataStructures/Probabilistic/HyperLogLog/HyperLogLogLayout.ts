import { HyperLogLog } from './HyperLogLog.ts'
import { LinearScene } from '../../../../visualization/LinearScene.ts'
import { ProbabilisticScene } from '../../../../visualization/ProbabilisticScene.ts'
import type { LinearModel, LinearFrame } from '../../../../visualization/LinearModel.ts'
import type { Scene } from '../../../../visualization/Scene.ts'

export class HyperLogLogLayout {
  public create(source: LinearModel, frame: LinearFrame = {}): Scene {
    const model = source as HyperLogLog
    const nodes = model.getRegisters().map((rank, index) => ProbabilisticScene.cell(`register-${index}`, String(rank), `register ${index} · max rank`, index % 4, Math.floor(index / 4), 180))
    return LinearScene.create(model, nodes, [], frame, {
      title: `16 registers · estimated distinct count ${model.estimate().toFixed(2)}`,
      description: 'Four hash bits choose a register; the remaining 60 bits determine leading-zero rank. Registers retain maxima, so duplicate adds are idempotent in the sketch. The harmonic estimator uses α16 = 0.673, with linear counting in the small range. Typical standard error is about 26% under ideal hashing, not a bound for every run. No exact distinct set is stored; this is classic HLL with a 64-bit hash, not HLL++.',
      code: 'E = 0.673 * 16² / Σ 2^(-M[j]); if E ≤ 40 and V > 0: E = 16 * ln(16 / V)',
    }, 'add operations recorded')
  }
}
