import type { ArrayEntry } from './FixedArray.ts'
import type {
  Scene,
  SceneNode,
  SceneSlot,
} from '../../../visualization/Scene.ts'

export interface ArrayFrame {
  readonly insertionIndex?: number
  readonly pending?: ArrayEntry
  readonly allocated?: boolean
  readonly prefixCopied?: number
  readonly suffixCopied?: number
  readonly activeSource?: number
  readonly copyingSource?: number
  readonly showPending?: boolean
  readonly inserted?: boolean
  readonly complete?: boolean
}

export class ArrayLayout {
  public create(entries: readonly ArrayEntry[], frame: ArrayFrame = {}): Scene {
    const nodes: SceneNode[] = []
    const slots: SceneSlot[] = []
    const middle = frame.insertionIndex ?? Math.floor(entries.length / 2)
    const sourceY = frame.allocated ? 150 : 278
    const resultY = frame.complete ? 278 : 420
    const occupied = new Set<number>()
    const animation = Boolean(frame.pending)

    for (let index = 0; index < entries.length; index += 1) {
      const copied =
        index < middle
          ? index < (frame.prefixCopied ?? 0)
          : index - middle < (frame.suffixCopied ?? 0)
      const destination = index < middle ? index : index + 1
      const reading = frame.activeSource === index
      const copying = frame.copyingSource === index

      nodes.push({
        ...entries[index],
        id: animation ? `source-${entries[index].id}` : entries[index].id,
        x: 80 + index * 92,
        y: sourceY,
        label: '',
        tone: reading ? 'active' : animation && copied ? 'visited' : 'default',
        status: reading ? 'READ' : 'COPIED',
        opacity: frame.complete ? 0 : 1,
      })
      slots.push({
        id: `source-slot-${index}`,
        x: 80 + index * 92,
        y: sourceY,
        label: frame.allocated ? `original [${index}]` : `index ${index}`,
        empty: false,
        highlighted: reading,
        opacity: frame.complete ? 0 : 1,
      })

      if (animation) {
        if (copied) occupied.add(destination)
        nodes.push({
          ...entries[index],
          x: 80 + (copied ? destination : index) * 92,
          y: copied ? resultY : sourceY,
          label: '',
          tone: copying ? 'active' : 'visited',
          status: copying ? 'COPYING' : 'COPIED',
          opacity: copied ? 1 : 0,
        })
      }
    }

    if (frame.pending) {
      if (frame.inserted) occupied.add(middle)
      nodes.push({
        ...frame.pending,
        x: 80 + middle * 92,
        y: frame.inserted ? resultY : 280,
        label: '',
        tone: 'new',
        opacity: frame.showPending ? 1 : 0,
      })
      const activeDestination =
        frame.copyingSource === undefined
          ? -1
          : frame.copyingSource < middle
            ? frame.copyingSource
            : frame.copyingSource + 1
      for (let index = 0; index <= entries.length; index += 1) {
        slots.push({
          id: `result-slot-${index}`,
          x: 80 + index * 92,
          y: resultY,
          label: frame.complete ? `index ${index}` : `new [${index}]`,
          empty: !occupied.has(index),
          highlighted:
            index === activeDestination ||
            Boolean(frame.showPending && !frame.inserted && index === middle),
          opacity: frame.allocated ? 1 : 0,
        })
      }
    }

    const focusSource = frame.activeSource ?? frame.copyingSource
    return {
      kind: 'array',
      nodes,
      edges: [],
      slots,
      width: Math.max(1100, 160 + entries.length * 92),
      height: animation ? 580 : 430,
      focusId:
        focusSource === undefined
          ? frame.showPending
            ? (frame.pending?.id ?? null)
            : null
          : frame.copyingSource === undefined
            ? `source-${entries[focusSource].id}`
            : entries[focusSource].id,
      count: entries.length + (frame.complete ? 1 : 0),
      annotations: animation
        ? [
            {
              id: 'source-array-label',
              x: 40,
              y: frame.allocated ? 55 : 150,
              text: `Original array · ${entries.length} fixed slots`,
              opacity: frame.complete ? 0 : 1,
            },
            {
              id: 'result-array-label',
              x: 40,
              y: frame.complete ? 170 : 345,
              text: `New array · ${entries.length + 1} fixed slots`,
              opacity: frame.allocated ? 1 : 0,
            },
          ]
        : [],
    }
  }
}
