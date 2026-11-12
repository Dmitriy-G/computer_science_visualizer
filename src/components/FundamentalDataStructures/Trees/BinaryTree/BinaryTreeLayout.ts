import type { BinaryTreeEntry } from './BinaryTree.ts'
import type { Scene, SceneEdge, SceneNode } from '../../../../visualization/Scene.ts'

export interface BinaryTreeFrame {
  readonly activeId?: string | null
  readonly visitedIds?: readonly string[]
  readonly pendingId?: string
  readonly showPending?: boolean
  readonly connectPending?: boolean
  readonly complete?: boolean
}

export class BinaryTreeLayout {
  public create(
    entries: readonly BinaryTreeEntry[],
    frame: BinaryTreeFrame = {},
  ): Scene {
    const byId = new Map<string, BinaryTreeEntry>()
    for (const entry of entries) byId.set(entry.id, entry)
    const positions = new Map<string, { x: number; y: number }>()
    const stack: { entry: BinaryTreeEntry; depth: number }[] = []
    let current: BinaryTreeEntry | null = entries[0] ?? null
    let depth = 0
    let maxDepth = 0
    let rank = 0
    while (current !== null || stack.length > 0) {
      while (current !== null) {
        stack.push({ entry: current, depth })
        current = current.leftId === null ? null : byId.get(current.leftId)!
        depth += 1
      }
      const item = stack.pop()!
      positions.set(item.entry.id, {
        x: 88 + rank * 128,
        y: 110 + item.depth * 154,
      })
      rank += 1
      maxDepth = Math.max(maxDepth, item.depth)
      current = item.entry.rightId === null ? null : byId.get(item.entry.rightId)!
      depth = item.depth + 1
    }

    const visited = new Set(frame.visitedIds)
    const nodes: SceneNode[] = []
    const edges: SceneEdge[] = []
    const labels = new Map<string, string>()
    if (entries[0]) labels.set(entries[0].id, 'root')
    for (const entry of entries) {
      if (entry.leftId) labels.set(entry.leftId, `left of ${entry.value}`)
      if (entry.rightId) labels.set(entry.rightId, `right of ${entry.value}`)
    }
    for (const entry of entries) {
      const pending = entry.id === frame.pendingId
      let tone: SceneNode['tone'] = visited.has(entry.id) ? 'visited' : 'default'
      if (entry.id === frame.activeId) tone = 'active'
      if (pending) tone = 'new'
      nodes.push({
        id: entry.id,
        value: entry.value,
        ...positions.get(entry.id)!,
        label:
          pending && !frame.complete
            ? 'new node (pending)'
            : labels.get(entry.id)!,
        tone,
        opacity: pending && !frame.showPending ? 0 : 1,
      })
      for (const childId of [entry.leftId, entry.rightId]) {
        if (childId === null) continue
        const pendingEdge = childId === frame.pendingId
        edges.push({
          id: `${entry.id}-${childId}`,
          from: entry.id,
          to: childId,
          directed: true,
          highlighted:
            pendingEdge ||
            (visited.has(entry.id) &&
              (visited.has(childId) || childId === frame.activeId)),
          opacity: pendingEdge && !frame.connectPending ? 0 : 1,
        })
      }
    }
    return {
      kind: 'binary-tree',
      nodes,
      edges,
      width: Math.max(1000, entries.length * 128 + 48),
      height: Math.max(480, 220 + maxDepth * 154),
      focusId: frame.showPending
        ? frame.pendingId ?? null
        : frame.activeId ?? null,
      count: entries.length - (frame.pendingId && !frame.complete ? 1 : 0),
      slots: frame.pendingId
        ? [{
            id: `empty-${frame.pendingId}`,
            ...positions.get(frame.pendingId)!,
            label: 'empty position',
            empty: true,
            highlighted: true,
            opacity: frame.showPending ? 0 : 1,
          }]
        : [],
    }
  }
}
