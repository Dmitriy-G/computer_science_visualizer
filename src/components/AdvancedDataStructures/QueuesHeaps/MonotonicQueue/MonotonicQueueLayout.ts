import { MonotonicQueue } from './MonotonicQueue.ts'
import { LinearScene } from '../../../../visualization/LinearScene.ts'
import type { LinearFrame, LinearModel } from '../../../../visualization/LinearModel.ts'
import type { Scene, SceneEdge, SceneNode } from '../../../../visualization/Scene.ts'

export class MonotonicQueueLayout {
  public create(model: LinearModel, frame: LinearFrame = {}): Scene {
    if (!(model instanceof MonotonicQueue)) throw new TypeError('Expected MonotonicQueue')
    const nodes: SceneNode[] = []
    const edges: SceneEdge[] = []
    const candidates = model.getCandidates()
    const retained = new Set<string>()
    for (let index = 0; index < candidates.length; index += 1) {
      const entry = candidates[index]
      retained.add(entry.id)
      nodes.push(LinearScene.node(entry.id, String(entry.value), `${index === 0 ? 'MAX / FRONT · ' : ''}arrival ${entry.index}${index === candidates.length - 1 ? ' · BACK' : ''}`, 140 + index * 250, 120, 140))
      if (index) edges.push(LinearScene.edge(candidates[index - 1].id, entry.id, 'next candidate'))
    }
    const window = model.getWindow()
    for (let index = 0; index < window.length; index += 1) {
      const entry = window[index]
      nodes.push(LinearScene.node(`history-${entry.id}`, String(entry.value), `window ${entry.index} · ${retained.has(entry.id) ? 'candidate' : 'dominated'}`, 140 + index * 250, 310, 140))
    }
    return LinearScene.create(model, nodes, edges, frame, 'window values')
  }
}
