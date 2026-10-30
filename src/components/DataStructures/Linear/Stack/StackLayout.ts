import type { StackEntry } from './Stack.ts'
import type { Scene, SceneNode } from '../../../../visualization/Scene.ts'

export interface StackFrame {
  readonly maxDepth?: number
  readonly count?: number
  readonly activeId?: string | null
  readonly activeStatus?: string
  readonly visitedIds?: readonly string[]
  readonly pending?: StackEntry
  readonly pendingY?: number
  readonly pendingStatus?: string
  readonly pendingTone?: SceneNode['tone']
  readonly focusId?: string | null
}

export class StackLayout {
  public create(entries: readonly StackEntry[], frame: StackFrame = {}): Scene {
    const nodes: SceneNode[] = []
    const depth = Math.max(entries.length, frame.maxDepth ?? 0)
    const height = Math.max(480, 160 + depth * 56)
    const bottomY = height - 80
    const visited = new Set(frame.visitedIds)
    for (let index = 0; index < entries.length; index += 1) {
      const entry = entries[index]
      const active = entry.id === frame.activeId
      nodes.push({
        ...entry,
        x: 280,
        y: bottomY - (entries.length - 1 - index) * 56,
        width: 160,
        height: 36,
        labelPlacement: 'right',
        label: entries.length === 1 ? 'top / bottom' : index === 0 ? 'top' : index === entries.length - 1 ? 'bottom' : '',
        tone: active ? 'active' : visited.has(entry.id) ? 'visited' : 'default',
        status: active ? frame.activeStatus ?? 'CURRENT' : 'VISITED',
        opacity: 1,
      })
    }
    if (frame.pending) {
      nodes.push({
        ...frame.pending,
        x: 280,
        y: frame.pendingY ?? bottomY - entries.length * 56,
        width: 160,
        height: 36,
        labelPlacement: 'right',
        label: frame.pendingStatus === 'REMOVING' ? 'removed top' : 'pending top',
        tone: frame.pendingTone ?? 'new',
        status: frame.pendingStatus ?? 'PENDING',
        opacity: 1,
      })
    }
    return {
      kind: 'stack',
      nodes,
      edges: [],
      slots: entries.length === 0 && !frame.pending
        ? [{ id: 'empty-stack', x: 280, y: bottomY, label: 'top = null', empty: true, highlighted: true, opacity: 1 }]
        : [],
      width: 620,
      height,
      count: frame.count ?? entries.length,
      focusId: frame.focusId !== undefined ? frame.focusId : frame.pending?.id ?? frame.activeId ?? null,
    }
  }
}
