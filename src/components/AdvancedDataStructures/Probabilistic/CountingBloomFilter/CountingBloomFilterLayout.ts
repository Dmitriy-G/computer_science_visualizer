import { CountingBloomFilter } from './CountingBloomFilter.ts'
import { LinearScene } from '../../../../visualization/LinearScene.ts'
import { ProbabilisticScene } from '../../../../visualization/ProbabilisticScene.ts'
import type { LinearModel, LinearFrame } from '../../../../visualization/LinearModel.ts'
import type { Scene } from '../../../../visualization/Scene.ts'

export class CountingBloomFilterLayout {
  public create(source: LinearModel, frame: LinearFrame = {}): Scene {
    const model = source as CountingBloomFilter
    const nodes = model.getCounters().map((counter, index) => ProbabilisticScene.cell(`counter-${index}`, String(counter), `counter ${index}`, index % 8, Math.floor(index / 8), 100))
    return LinearScene.create(model, nodes, [], frame, 'live insertion occurrences')
  }
}
