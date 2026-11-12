import { SkipList } from './SkipList.ts'
import { LinearScene } from '../../../../visualization/LinearScene.ts'
import type { LinearFrame, LinearModel } from '../../../../visualization/LinearModel.ts'
import type { Scene, SceneEdge, SceneNode } from '../../../../visualization/Scene.ts'

export class SkipListLayout {
  public create(model: LinearModel, frame: LinearFrame = {}): Scene {
    if (!(model instanceof SkipList)) throw new TypeError('Expected SkipList')
    const nodes: SceneNode[] = []
    const edges: SceneEdge[] = []
    const entries = model.getNodes()
    for (let index = 0; index < entries.length; index += 1) {
      const entry = entries[index]
      for (let level = 0; level < entry.next.length; level += 1) {
        const id = `${entry.id}-level-${level}`
        nodes.push(LinearScene.node(id, index === 0 ? 'HEAD' : String(entry.value), `level ${level}`, 90 + index * 140, 90 + (SkipList.maximumLevel - 1 - level) * 125))
        if (entry.next[level]) edges.push(LinearScene.edge(id, `${entry.next[level]!.id}-level-${level}`, 'next'))
        if (level > 0) edges.push(LinearScene.edge(id, `${entry.id}-level-${level - 1}`, 'down'))
      }
    }
    return LinearScene.create(model, nodes, edges, frame, 'keys')
  }
}
