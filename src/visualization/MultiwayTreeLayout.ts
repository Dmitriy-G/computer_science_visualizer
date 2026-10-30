import type { MultiwayTreeEntry } from './TreeTrace.ts'
import type { TreeFrame } from './TreeActionAnimation.ts'
import type { Scene, SceneNode, SceneEdge, StructureKind } from './Scene.ts'

export class MultiwayTreeLayout {
  private readonly kind: StructureKind

  constructor(kind: StructureKind) { this.kind = kind }

  public createEntries(entries: readonly MultiwayTreeEntry[], size: number, frame: TreeFrame = {}): Scene {
    const byId = new Map<string, MultiwayTreeEntry>()
    const positions = new Map<string, { x: number; y: number }>()
    const visited = new Set(frame.visitedIds)
    for (const entry of entries) byId.set(entry.id, entry)
    const cursor = { x: 100, maxDepth: 0 }
    if (entries[0]) this.place(entries[0].id, 0, byId, positions, cursor)
    const nodes: SceneNode[] = []
    const edges: SceneEdge[] = []
    let focusId: string | null = null
    for (const entry of entries) {
      const active = entry.id === frame.activeId
      const role = entry.id === entries[0]?.id ? `root / ${entry.leaf ? 'leaf' : 'internal'}` : entry.leaf ? 'leaf' : 'internal'
      nodes.push({ id: entry.id, value: entry.keys[0] ?? 0, keys: [...entry.keys], ...positions.get(entry.id)!, width: Math.max(80, entry.keys.length * 54 + 20), height: 54,
        label: `${role}${this.kind === 'b-plus-tree' && !entry.leaf ? ' / separators' : ''}`,
        tone: active ? 'active' : visited.has(entry.id) ? 'visited' : 'default', status: active ? frame.status ?? 'CURRENT' : 'VISITED', opacity: 1,
      })
      if (active) focusId = entry.id
      for (const childId of entry.childIds) edges.push({ id: `${entry.id}-${childId}`, from: entry.id, to: childId, directed: true, highlighted: childId === frame.activeId, opacity: 1 })
      if (entry.nextId && byId.has(entry.nextId)) edges.push({ id: `${entry.id}-next-${entry.nextId}`, from: entry.id, to: entry.nextId, label: 'next leaf', bend: 20, directed: true, highlighted: entry.nextId === frame.activeId, opacity: 1 })
    }
    return { kind: this.kind, nodes, edges, count: frame.count ?? size, width: Math.max(1000, cursor.x + 80), height: Math.max(480, 270 + cursor.maxDepth * 170), focusId,
      slots: entries.length ? [] : [{ id: `${this.kind}-empty`, x: 140, y: 130, label: 'root = null', empty: true, highlighted: true, opacity: 1 }],
    }
  }

  private place(id: string, depth: number, byId: ReadonlyMap<string, MultiwayTreeEntry>, positions: Map<string, { x: number; y: number }>, cursor: { x: number; maxDepth: number }): number {
    const entry = byId.get(id)!
    const width = Math.max(80, entry.keys.length * 54 + 20)
    let x: number
    if (!entry.childIds.length) {
      x = cursor.x + width / 2
      cursor.x += width + 100
    } else {
      let first = 0
      let last = 0
      for (let index = 0; index < entry.childIds.length; index += 1) {
        const childX = this.place(entry.childIds[index], depth + 1, byId, positions, cursor)
        if (index === 0) first = childX
        last = childX
      }
      x = (first + last) / 2
    }
    cursor.maxDepth = Math.max(cursor.maxDepth, depth)
    positions.set(id, { x, y: 130 + depth * 170 })
    return x
  }
}
