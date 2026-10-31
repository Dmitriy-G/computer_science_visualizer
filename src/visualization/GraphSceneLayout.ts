import type { GraphModel } from './GraphModel.ts'
import type { Scene, SceneEdge, SceneNode } from './Scene.ts'

export interface GraphFrame {
  readonly count?: number
  readonly visitedIds?: readonly string[]
  readonly activeIds?: readonly string[]
  readonly edgeIds?: readonly string[]
  readonly status?: string
}

export class GraphSceneLayout {
  public create(model: GraphModel, frame: GraphFrame = {}): Scene {
    const entries = model.getEntries()
    const links = model.getEdges()
    const visited = new Set(frame.visitedIds)
    const active = new Set(frame.activeIds)
    const highlighted = new Set(frame.edgeIds)
    const groups = new Map<string, typeof links>()
    for (const edge of links) {
      const key = JSON.stringify([edge.from, edge.to].sort())
      const group = groups.get(key) ?? []
      group.push(edge)
      groups.set(key, group)
    }
    let maxLanes = 1
    let maxLoops = 0
    for (const group of groups.values()) {
      if (group[0].from === group[0].to) maxLoops = Math.max(maxLoops, group.length)
      else maxLanes = Math.max(maxLanes, group.length)
    }
    const margin = Math.max(100, 120 + maxLoops * 44, 100 + maxLanes * 24)
    const radius = Math.max(220, entries.length * 20)
    const width = radius * 2 + margin * 2
    const nodes: SceneNode[] = []
    for (let index = 0; index < entries.length; index += 1) {
      const entry = entries[index]
      const angle = index * Math.PI * 2 / entries.length - Math.PI / 2
      nodes.push({ id: entry.id, value: entry.value, x: width / 2 + Math.cos(angle) * radius, y: width / 2 + Math.sin(angle) * radius,
        label: `vertex ${entry.value}`, tone: active.has(entry.id) ? 'active' : visited.has(entry.id) ? 'visited' : 'default',
        status: active.has(entry.id) ? frame.status ?? 'CURRENT' : 'VISITED', opacity: 1 })
    }
    const edges: SceneEdge[] = []
    for (const group of groups.values()) {
      for (let index = 0; index < group.length; index += 1) {
        const edge = group[index]
        const orientation = edge.from < edge.to ? 1 : -1
        edges.push({ id: edge.id, from: edge.from, to: edge.to, directed: model.directed, highlighted: highlighted.has(edge.id), opacity: 1,
          label: `e${edge.number}${model.weighted ? `: ${edge.weight}` : ''}`,
          curveOffset: (index - (group.length - 1) / 2) * 42 * orientation,
          loopRadius: edge.from === edge.to ? 62 + index * 28 : undefined })
      }
    }
    return { kind: model.kind, nodes, edges, width, height: width, focusId: frame.activeIds?.[0] ?? null,
      count: frame.count ?? model.length, countLabel: 'vertices',
      hint: { title: `${model.edgeCount} edges · ${model.directed ? 'directed' : 'undirected'}${model.weighted ? ' · nonnegative weights' : ''}`,
        description: model.kind === 'dag' ? 'A directed acyclic graph: an edge that creates a cycle is rejected. Edge labels are stable IDs.'
          : model.kind === 'multigraph' ? 'Parallel edges and self-loops are allowed. Remove a specific edge using its e-number.'
          : 'Edge labels identify edges for removal. Vertex values identify endpoints; new values must be unique.' } }
  }
}
