import { EdgeList } from './EdgeList.ts'
import { ExtendedGraphLayout } from '../../../../visualization/ExtendedGraphLayout.ts'
import { LinearScene } from '../../../../visualization/LinearScene.ts'
import type { LinearFrame, LinearModel } from '../../../../visualization/LinearModel.ts'
import type { Scene } from '../../../../visualization/Scene.ts'

export class EdgeListLayout extends ExtendedGraphLayout {
  public create(model: LinearModel, frame: LinearFrame = {}): Scene {
    if (!(model instanceof EdgeList)) throw new TypeError('Expected EdgeList')
    const drawing = this.topology(model)
    const start = drawing.right + 170
    const values = new Map<string, number>()
    for (const vertex of model.getVertices()) values.set(vertex.id, vertex.value)
    const edges = model.getEdges()
    for (let index = 0; index < edges.length; index += 1) {
      const edge = edges[index]
      drawing.nodes.push(LinearScene.node(`edge-record-${edge.number}`, `${values.get(edge.from)} → ${values.get(edge.to)}`, `record ${index} · e${edge.number}`, start + index % 3 * 260, 120 + Math.floor(index / 3) * 140, 190))
    }
    return this.finish(model, drawing, frame)
  }
}
