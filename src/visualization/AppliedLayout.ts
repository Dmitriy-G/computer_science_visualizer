import { AppliedModel } from './AppliedModel.ts'
import { LinearScene } from './LinearScene.ts'
import type { LinearModel, LinearFrame, LinearSceneFactory } from './LinearModel.ts'
import type { Scene, SceneNode, SceneEdge } from './Scene.ts'

// Storage rows and links are semantic model data; all pixel geometry lives here.
export class AppliedLayout implements LinearSceneFactory {
  public create(model: LinearModel, frame: LinearFrame = {}): Scene {
    if (!(model instanceof AppliedModel)) throw new TypeError('Expected an applied structure model')
    const diagram = model.getDiagram()
    const nodes: SceneNode[] = []
    const edges: SceneEdge[] = []
    let rowIndex = 0
    for (const row of diagram.rows) {
      let x = 40
      for (let index = 0; index < row.length; index += 1) {
        const entry = row[index]
        if (index % 6 === 0) x = 40
        const width = Math.max(190, entry.text.length * 10 + 32, entry.label.length * 7 + 32)
        nodes.push(LinearScene.node(entry.id, entry.text, entry.label, x + width / 2, 150 + (rowIndex + Math.floor(index / 6)) * 180, width))
        x += width + 50
        for (const child of entry.children ?? []) edges.push(LinearScene.edge(entry.id, child, 'child'))
      }
      rowIndex += Math.max(1, Math.ceil(row.length / 6))
    }
    const positions = new Map<string, SceneNode>()
    for (const node of nodes) positions.set(node.id, node)
    const routes = new Map<string, number>()
    for (const link of diagram.links ?? []) {
      const edge = LinearScene.edge(link.from, link.to, link.label)
      const from = positions.get(link.from)
      const to = positions.get(link.to)
      const pair = [link.from, link.to].sort().join('|')
      const route = routes.get(pair) ?? 0
      routes.set(pair, route + 1)
      const curveOffset = from && to && from.y === to.y && from.id !== to.id
        ? (from.x <= to.x ? -1 : 1) * (90 + route * 35)
        : route * 30
      edges.push({ ...edge, curveOffset, highlighted: frame.edgeIds?.includes(edge.id) ?? false })
    }
    return LinearScene.create(model, nodes, edges, frame, { title: 'Representation', description: model.representation }, model.countLabel)
  }
}
