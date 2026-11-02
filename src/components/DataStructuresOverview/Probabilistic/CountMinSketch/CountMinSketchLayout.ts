import { CountMinSketch } from './CountMinSketch.ts'
import { LinearScene } from '../../../../visualization/LinearScene.ts'
import { ProbabilisticScene } from '../../../../visualization/ProbabilisticScene.ts'
import type { LinearModel, LinearFrame } from '../../../../visualization/LinearModel.ts'
import type { Scene, SceneNode } from '../../../../visualization/Scene.ts'

export class CountMinSketchLayout {
  public create(source: LinearModel, frame: LinearFrame = {}): Scene {
    const model = source as CountMinSketch
    const counters = model.getCounters()
    const values = counters.flat().map(String)
    const width = ProbabilisticScene.width(values, [], 120)
    const nodes: SceneNode[] = []
    for (let row = 0; row < 3; row += 1) {
      for (let column = 0; column < 8; column += 1) nodes.push(ProbabilisticScene.cell(`cms-${row}-${column}`, counters[row][column].toString(), `row ${row} · col ${column}`, column, row, width))
    }
    return LinearScene.create(model, nodes, [], frame, {
      title: `3 rows × 8 counters · total weight ${model.totalWeight}`,
      description: 'Each row uses a different fixed hash seed. Add a positive weight to one counter per row and estimate by their minimum. BigInt counters do not overflow. Positive updates guarantee no underestimation, but collisions can inflate the answer. No exact item registry or negative updates are used. Hash seeds are deterministic; ideal independence bounds are not guarantees for adversarial inputs.',
      code: 'C[row][h_row(value) mod 8] += weight; estimate(value) = min_row C[row][h_row(value) mod 8]',
    }, 'update operations recorded')
  }
}
