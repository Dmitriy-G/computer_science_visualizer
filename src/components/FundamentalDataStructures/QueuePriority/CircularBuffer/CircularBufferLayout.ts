import type { CircularBuffer, CircularBufferEntry } from './CircularBuffer.ts'
import type { Scene, SceneNode, SceneSlot } from '../../../../visualization/Scene.ts'

export interface CircularBufferFrame {
  readonly count?: number
  readonly activeId?: string | null
  readonly activeStatus?: string
  readonly activeSlot?: number
  readonly readIndex?: number
  readonly writeIndex?: number
  readonly activeTone?: SceneNode['tone']
  readonly visitedIds?: readonly string[]
  readonly pending?: CircularBufferEntry
  readonly pendingOffset?: number
}

export class CircularBufferLayout {
  public create(buffer: CircularBuffer, frame: CircularBufferFrame = {}): Scene {
    const nodes: SceneNode[] = []
    const slots: SceneSlot[] = []
    const entries = buffer.getEntries()
    const visited = new Set(frame.visitedIds)
    const radius = Math.max(230, buffer.capacity * 23)
    const center = radius + 150
    for (let index = 0; index < buffer.capacity; index += 1) {
      const angle = -Math.PI / 2 + index * Math.PI * 2 / buffer.capacity
      const x = center + radius * Math.cos(angle)
      const y = center + radius * Math.sin(angle)
      let entry: CircularBufferEntry | undefined
      for (const candidate of entries) if (candidate.slot === index) entry = candidate
      const roles = [String(index)]
      if (index === (frame.readIndex ?? buffer.readIndex)) roles.push('read')
      if (index === (frame.writeIndex ?? buffer.writeIndex)) roles.push(buffer.isFull() ? 'write / full' : 'write')
      slots.push({ id: `buffer-slot-${index}`, x, y, label: roles.join(' / '), empty: !entry, highlighted: index === frame.activeSlot, opacity: 1 })
      if (entry) {
        const active = entry.id === frame.activeId
        nodes.push({ id: entry.id, value: entry.value, x, y, label: '', tone: active ? frame.activeTone ?? 'active' : visited.has(entry.id) ? 'visited' : 'default', status: active ? frame.activeStatus ?? 'CURRENT' : 'VISITED', opacity: 1 })
      }
      if (frame.pending?.slot === index) {
        const offset = frame.pendingOffset ?? 80
        nodes.push({ id: frame.pending.id, value: frame.pending.value, x: x + offset * Math.cos(angle), y: y + offset * Math.sin(angle), label: 'pending', tone: 'new', status: 'PENDING', opacity: 1 })
      }
    }
    return { kind: 'circular-buffer', nodes, slots, edges: [], width: center * 2, height: center * 2, count: frame.count ?? buffer.length, focusId: frame.pending?.id ?? frame.activeId ?? null }
  }
}
