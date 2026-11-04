import type { GraphEntry } from './Graph.ts'
import type { Scene, SceneNode, SceneEdge } from '../../../../visualization/Scene.ts'

export class GraphLayout {
  public create(entries: readonly GraphEntry[]): Scene {
    const nodes: SceneNode[] = []
    const edges: SceneEdge[] = []
    const seen = new Set<string>()
    for (let index = 0; index < entries.length; index += 1) {
      const entry = entries[index]
      const angle = index * Math.PI * 2 / entries.length - Math.PI / 2
      nodes.push({ id: entry.id, value: entry.value, x: 500 + Math.cos(angle) * 340, y: 295 + Math.sin(angle) * 190, label: `vertex ${entry.id.slice(6)}`, tone: 'default', opacity: 1 })
      seen.add(entry.id)
      for (const to of entry.neighborIds) {
        if (seen.has(to) && to !== entry.id) continue
        const ids = [entry.id, to].sort()
        edges.push({ id: `edge-${ids[0]}-${ids[1]}`, from: entry.id, to, directed: false, highlighted: false, opacity: 1 })
      }
    }
    return { kind: 'graph', nodes, edges, width: 1000, height: 600, focusId: null, count: entries.length }
  }
}
