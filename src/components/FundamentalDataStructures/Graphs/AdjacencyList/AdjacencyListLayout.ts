import { AdjacencyList } from './AdjacencyList.ts'
import { ExtendedGraphLayout } from '../../../../visualization/ExtendedGraphLayout.ts'
import { LinearScene } from '../../../../visualization/LinearScene.ts'
import type { LinearFrame, LinearModel } from '../../../../visualization/LinearModel.ts'
import type { Scene } from '../../../../visualization/Scene.ts'

export class AdjacencyListLayout extends ExtendedGraphLayout {
  public create(model: LinearModel, frame: LinearFrame = {}): Scene {
    if (!(model instanceof AdjacencyList)) throw new TypeError('Expected AdjacencyList')
    const drawing = this.topology(model)
    const start = drawing.right + 120
    const vertices = model.getVertices()
    const values = new Map<string, number>()
    for (const vertex of vertices) values.set(vertex.id, vertex.value)
    for (let row = 0; row < vertices.length; row += 1) {
      const vertex = vertices[row]
      const entries = model.getRow(vertex.id)
      const head = `list-head-${vertex.id}`
      const y = 110 + row * 135
      drawing.nodes.push(LinearScene.node(head, String(vertex.value), `row ${row} · ${entries.length ? 'head' : 'empty'}`, start, y, 90))
      let previous = head
      for (let index = 0; index < entries.length; index += 1) {
        const edge = entries[index]
        const id = `list-${edge.number}`
        drawing.nodes.push(LinearScene.node(id, String(values.get(edge.to)), `e${edge.number} · entry ${index}`, start + 190 + index * 160, y, 90))
        drawing.edges.push(LinearScene.edge(previous, id, 'order'))
        previous = id
      }
    }
    return this.finish(model, drawing, frame)
  }
}
