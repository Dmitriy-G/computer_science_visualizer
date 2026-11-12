import { HyperLogLog } from './HyperLogLog.ts'
import { LinearScene } from '../../../../visualization/LinearScene.ts'
import { ProbabilisticScene } from '../../../../visualization/ProbabilisticScene.ts'
import type { LinearModel, LinearFrame } from '../../../../visualization/LinearModel.ts'
import type { Scene } from '../../../../visualization/Scene.ts'

export class HyperLogLogLayout {
  public create(source: LinearModel, frame: LinearFrame = {}): Scene {
    const model = source as HyperLogLog
    const nodes = model.getRegisters().map((rank, index) => ProbabilisticScene.cell(`register-${index}`, String(rank), `register ${index} · max rank`, index % 4, Math.floor(index / 4), 180))
    return LinearScene.create(model, nodes, [], frame, 'add operations recorded')
  }
}
