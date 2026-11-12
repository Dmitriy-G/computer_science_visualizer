import { LinearScene } from '../../../../visualization/LinearScene.ts'
import type { LinearModel, LinearFrame } from '../../../../visualization/LinearModel.ts'
import type { Scene, SceneNode } from '../../../../visualization/Scene.ts'
import { IntervalSet } from './IntervalSet.ts'

export class IntervalSetLayout {
  public create(model: LinearModel, frame: LinearFrame = {}): Scene {
    if (!(model instanceof IntervalSet)) throw new TypeError('Expected interval set')
    const nodes: SceneNode[] = []
    let index = 0
    for (const interval of model.getIntervals()) {
      const text = `[${interval.minimum}, ${interval.maximum}]`
      const width = Math.max(220, text.length * 13)
      nodes.push(LinearScene.node(interval.id, text, `interval ${index}`, 310 + index % 2 * 640, 110 + Math.floor(index / 2) * 160, width))
      index += 1
    }
    return LinearScene.create(model, nodes, [], frame, 'intervals')
  }
}
