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
    return LinearScene.create(model, nodes, [], frame, 'update operations recorded')
  }
}
