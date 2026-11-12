import { LinearScene } from '../../../../visualization/LinearScene.ts'
import type { LinearModel, LinearFrame } from '../../../../visualization/LinearModel.ts'
import type { Scene, SceneNode } from '../../../../visualization/Scene.ts'
import { Multiset } from './Multiset.ts'

export class MultisetLayout {
  public create(model: LinearModel, frame: LinearFrame = {}): Scene {
    if (!(model instanceof Multiset)) throw new TypeError('Expected multiset')
    const nodes: SceneNode[] = []
    let index = 0
    for (const entry of model.getEntries()) {
      nodes.push(LinearScene.node(entry.id, String(entry.value), `count ${entry.count}`, 160 + index % 4 * 310, 110 + Math.floor(index / 4) * 160, 260))
      index += 1
    }
    return LinearScene.create(model, nodes, [], frame, 'occurrences')
  }
}
