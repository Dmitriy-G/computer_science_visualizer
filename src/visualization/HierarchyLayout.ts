import type { AdditionalTreeModel, TreeDiagramEntry } from './AdditionalTreeModel.ts'
import type { TreeFrame } from './TreeActionAnimation.ts'
import type { Scene, SceneEdge, SceneNode } from './Scene.ts'

export class HierarchyLayout {
  public create(model: AdditionalTreeModel, frame: TreeFrame = {}): Scene {
    const entries = model.getDiagram()
    const byId = new Map<string, TreeDiagramEntry>()
    const children = new Set<string>()
    for (const entry of entries) {
      byId.set(entry.id, entry)
      for (const id of entry.children) children.add(id)
    }
    const nodes: SceneNode[] = []
    const edges: SceneEdge[] = []
    const visited = new Set(frame.visitedIds)
    let cursor = 90
    let maxDepth = 0
    const place = (entry: TreeDiagramEntry, depth: number): number => {
      maxDepth = Math.max(maxDepth, depth)
      let first = 0
      let last = 0
      for (const id of entry.children) {
        const child = byId.get(id)
        if (!child) continue
        const x = place(child, depth + 1)
        if (!first) first = x
        last = x
        edges.push({ id: `${entry.id}-${id}`, from: entry.id, to: id, directed: true, highlighted: id === frame.activeId, opacity: 1 })
      }
      const width = entry.width ?? 110
      const x = first ? (first + last) / 2 : cursor + width / 2
      if (!first) cursor += width + 60
      const active = entry.id === frame.activeId
      const pending = entry.id === frame.pendingId
      nodes.push({ id: entry.id, value: 0, displayValue: entry.text, label: entry.label, x, y: 90 + depth * 140,
        width, height: 54, opacity: 1,
        tone: pending ? 'new' : active ? 'active' : visited.has(entry.id) ? 'visited' : 'default',
        status: pending ? 'PENDING' : active ? frame.status ?? 'CURRENT' : visited.has(entry.id) ? 'VISITED' : undefined,
      })
      return x
    }
    for (const entry of entries) if (!children.has(entry.id)) place(entry, 0)
    return { kind: model.kind, nodes, edges, width: Math.max(720, cursor + 80), height: Math.max(340, 230 + maxDepth * 140),
      count: frame.count ?? model.length, focusId: frame.activeId ?? null,
      slots: entries.length ? [] : [{ id: `${model.kind}-empty`, x: 120, y: 100, label: 'empty', empty: true, highlighted: false, opacity: 1 }],
    }
  }
}
