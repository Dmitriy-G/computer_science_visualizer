import { Hypergraph } from './Hypergraph.ts'
import { ExtendedGraphLayout } from '../../../../visualization/ExtendedGraphLayout.ts'
import { LinearScene } from '../../../../visualization/LinearScene.ts'
import type { LinearFrame, LinearModel } from '../../../../visualization/LinearModel.ts'
import type { Scene, SceneEdge, SceneNode } from '../../../../visualization/Scene.ts'

export class HypergraphLayout extends ExtendedGraphLayout {
  public create(model: LinearModel, frame: LinearFrame = {}): Scene {
    if (!(model instanceof Hypergraph)) throw new TypeError('Expected Hypergraph')
    const nodes: SceneNode[] = []
    const edges: SceneEdge[] = []
    const vertices = model.getVertices()
    for (let index = 0; index < vertices.length; index += 1) nodes.push({ ...LinearScene.node(vertices[index].id, String(vertices[index].value), `vertex ${vertices[index].value}`, 140, 100 + index * 140, 90), value: vertices[index].value, height: 90 })
    const hyperedges = model.getEdges()
    for (let index = 0; index < hyperedges.length; index += 1) {
      const edge = hyperedges[index]
      const id = `hyperedge-${edge.number}`
      nodes.push({ ...LinearScene.node(id, `H${edge.number}`, `${edge.members!.length} members`, 660, 120 + index * 170, 100), height: 100 })
      for (const member of edge.members!) edges.push({ id: `${edge.id}:${member}`, from: member, to: id, directed: false, highlighted: false, opacity: 1 })
    }
    return this.finish(model, { nodes, edges, right: 800 }, frame)
  }
}
