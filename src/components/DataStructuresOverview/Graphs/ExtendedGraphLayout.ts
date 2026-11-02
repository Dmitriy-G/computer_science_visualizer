import { ExtendedGraphModel } from './ExtendedGraphModel.ts'
import type { ExtendedVertex } from './ExtendedGraphModel.ts'
import { LinearScene } from '../../../visualization/LinearScene.ts'
import type { LinearFrame, LinearModel } from '../../../visualization/LinearModel.ts'
import type { Scene, SceneEdge, SceneNode } from '../../../visualization/Scene.ts'

export interface GraphDrawing {
  readonly nodes: SceneNode[]
  readonly edges: SceneEdge[]
  readonly right: number
}

export class ExtendedGraphLayout {
  protected positions(model: ExtendedGraphModel): ReadonlyMap<string, readonly [number, number]> {
    const vertices = model.getVertices()
    const positions = new Map<string, readonly [number, number]>()
    if (model.kind === 'bipartite-graph') {
      const counts = [0, 0]
      for (const vertex of vertices) {
        const partition = vertex.partition!
        positions.set(vertex.id, [140 + partition * 500, 110 + counts[partition]++ * 145])
      }
    } else if (model.kind === 'tree-graph' && vertices.length) {
      const seen = new Set([vertices[0].id])
      let level = [vertices[0].id]
      let depth = 0
      while (level.length) {
        const next: string[] = []
        for (let index = 0; index < level.length; index += 1) {
          const id = level[index]
          positions.set(id, [120 + index * 170, 100 + depth * 150])
          for (const neighbor of model.getNeighbors(id)) if (!seen.has(neighbor)) {
            seen.add(neighbor)
            next.push(neighbor)
          }
        }
        level = next
        depth += 1
      }
    } else {
      const radius = Math.max(220, vertices.length * 22)
      const center = radius + 170
      for (let index = 0; index < vertices.length; index += 1) {
        const angle = index * 2 * Math.PI / vertices.length - Math.PI / 2
        positions.set(vertices[index].id, [center + Math.cos(angle) * radius, center + Math.sin(angle) * radius])
      }
    }
    return positions
  }

  protected role(model: ExtendedGraphModel, vertex: ExtendedVertex): string {
    return model.kind === 'bipartite-graph' ? `${vertex.partition === 0 ? 'L' : 'R'} · ${vertex.value}` : `vertex ${vertex.value}`
  }

  protected topology(model: ExtendedGraphModel): GraphDrawing {
    const nodes: SceneNode[] = []
    const edges: SceneEdge[] = []
    const positions = this.positions(model)
    let right = 760
    for (const vertex of model.getVertices()) {
      const position = positions.get(vertex.id)!
      nodes.push({ ...LinearScene.node(vertex.id, String(vertex.value), this.role(model, vertex), position[0], position[1], 80), value: vertex.value, height: 80 })
      right = Math.max(right, position[0] + 110)
    }
    const links = model.getEdges()
    for (const edge of links) {
      const reverse = model.directed && edge.from !== edge.to && links.some((other) => other.from === edge.to && other.to === edge.from)
      edges.push({ id: edge.id, from: edge.from, to: edge.to, directed: model.directed, highlighted: false, opacity: 1,
        label: model.kind === 'complete-graph' ? undefined : edge.capacity !== undefined ? `e${edge.number}: ${edge.flow ?? 0n}/${edge.capacity}` : `e${edge.number}`,
        curveOffset: reverse ? 40 : 0, loopRadius: edge.from === edge.to ? 62 : undefined })
    }
    return { nodes, edges, right }
  }

  protected finish(model: ExtendedGraphModel, drawing: GraphDrawing, frame: LinearFrame): Scene {
    const highlighted = new Set(frame.edgeIds)
    const edges: SceneEdge[] = []
    for (const edge of drawing.edges) edges.push({ ...edge, highlighted: highlighted.has(edge.id) || highlighted.has(edge.id.split(':')[0]) })
    const limits = model.kind === 'hypergraph' ? 'Example limits: 16 vertices and 32 hyperedges.' : 'Example limits: 16 vertices and 128 edges.'
    return LinearScene.create(model, drawing.nodes, edges, frame,
      { title: `${model.edgeCount} ${model.kind === 'hypergraph' ? 'hyperedges' : 'edges'}`, description: `${model.hint} ${limits}` }, 'vertices')
  }

  public create(model: LinearModel, frame: LinearFrame = {}): Scene {
    if (!(model instanceof ExtendedGraphModel)) throw new TypeError('Expected an extended graph')
    return this.finish(model, this.topology(model), frame)
  }
}
