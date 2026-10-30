import type { LinkedListEntry } from './LinkedList.ts'
import type { Scene, SceneEdge, SceneNode } from '../../../../visualization/Scene.ts'

export interface LinkedListFrame {
  readonly activeIndex?: number
  readonly visitedThrough?: number
  readonly insertionIndex?: number
  readonly pendingNode?: LinkedListEntry
  readonly showPending?: boolean
  readonly detached?: boolean
  readonly gap?: boolean
  readonly lowered?: boolean
  readonly connectNext?: boolean
  readonly connectPrevious?: boolean
  readonly complete?: boolean
}

export class LinkedListLayout {
  public create(
    entries: readonly LinkedListEntry[],
    frame: LinkedListFrame = {},
  ): Scene {
    const nodes: SceneNode[] = []
    const edges: SceneEdge[] = []
    const middle = frame.insertionIndex ?? Math.floor(entries.length / 2)
    const gap = frame.gap ? 112 : 0
    const activeIndex = frame.activeIndex ?? -1

    for (let index = 0; index < entries.length; index += 1) {
      let tone: SceneNode['tone'] = 'default'
      if (index <= (frame.visitedThrough ?? -1)) tone = 'visited'
      if (index === activeIndex) tone = 'active'
      const shiftedIndex = frame.complete && index >= middle ? index + 1 : index
      nodes.push({
        id: entries[index].id,
        value: entries[index].value,
        x: 88 + index * 112 + (index >= middle ? gap : 0),
        y: 278,
        label: `${index === 0 ? 'head · ' : ''}index ${shiftedIndex}`,
        tone,
        opacity: 1,
      })

      if (index < entries.length - 1) {
        edges.push({
          id: `${entries[index].id}-${entries[index + 1].id}`,
          from: entries[index].id,
          to: entries[index + 1].id,
          directed: true,
          highlighted: index < activeIndex,
          opacity: frame.detached && index === middle - 1 ? 0 : 1,
        })
      }
    }

    if (frame.pendingNode) {
      const pending = frame.pendingNode
      nodes.push({
        id: pending.id,
        value: pending.value,
        x: Math.max(88, 88 + (middle - 0.5) * 112 + (frame.gap ? 56 : 0)),
        y: frame.lowered ? 278 : 130,
        label: frame.complete ? `index ${middle}` : 'new node',
        tone: 'new',
        opacity: frame.showPending ? 1 : 0,
      })

      if (entries[middle]) edges.push({
        id: `${pending.id}-next`,
        from: pending.id,
        to: entries[middle].id,
        directed: true,
        highlighted: true,
        opacity: frame.connectNext ? 1 : 0,
      })
      if (entries[middle - 1]) edges.push({
        id: `${pending.id}-previous`,
        from: entries[middle - 1].id,
        to: pending.id,
        directed: true,
        highlighted: true,
        opacity: frame.connectPrevious ? 1 : 0,
      })
    }

    return {
      kind: 'linked-list',
      nodes,
      edges,
      width: Math.max(
        1240,
        88 + (entries.length + (frame.pendingNode ? 1 : 0)) * 112,
      ),
      height: 430,
      focusId: frame.showPending
        ? (frame.pendingNode?.id ?? null)
        : (entries[activeIndex]?.id ?? null),
      count: entries.length + (frame.complete ? 1 : 0),
    }
  }
}
