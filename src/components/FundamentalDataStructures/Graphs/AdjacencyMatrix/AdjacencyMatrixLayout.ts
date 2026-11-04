import { AdjacencyMatrix } from './AdjacencyMatrix.ts'
import { ExtendedGraphLayout } from '../../../../visualization/ExtendedGraphLayout.ts'
import { LinearScene } from '../../../../visualization/LinearScene.ts'
import type { LinearFrame, LinearModel } from '../../../../visualization/LinearModel.ts'
import type { Scene } from '../../../../visualization/Scene.ts'

export class AdjacencyMatrixLayout extends ExtendedGraphLayout {
  public create(model: LinearModel, frame: LinearFrame = {}): Scene {
    if (!(model instanceof AdjacencyMatrix)) throw new TypeError('Expected AdjacencyMatrix')
    const drawing = this.topology(model)
    const start = drawing.right + 160
    const vertices = model.getVertices()
    const highlighted = new Set(frame.edgeIds)
    for (let index = 0; index < vertices.length; index += 1) {
      drawing.nodes.push(LinearScene.node(`matrix-row-${index}`, String(vertices[index].value), `row ${index}`, start - 100, 220 + index * 120, 70))
      drawing.nodes.push(LinearScene.node(`matrix-column-${index}`, String(vertices[index].value), `column ${index}`, start + index * 100, 90, 70))
    }
    for (let row = 0; row < vertices.length; row += 1) for (let column = 0; column < vertices.length; column += 1) {
      const edge = model.getCell(row, column)
      const cell = LinearScene.node(`matrix-${row}-${column}`, edge ? '1' : '0', `[${row},${column}]`, start + column * 100, 220 + row * 120, 62)
      drawing.nodes.push({ ...cell, tone: edge && highlighted.has(edge.id) ? 'active' : 'default', status: edge && highlighted.has(edge.id) ? 'EDGE' : undefined })
    }
    return this.finish(model, drawing, frame)
  }
}
