import { ArrayLayout } from './ArrayLayout.ts'
import type { ArrayEntry } from './FixedArray.ts'
import type { ArraySortFrame } from './ArraySortTrace.ts'
import type { Scene, SceneNode, SceneSlot } from '../../../../visualization/Scene.ts'

export class ArraySortingLayout {
  public create(entries: readonly ArrayEntry[], frame: ArraySortFrame = {}): Scene {
    const scene = new ArrayLayout().create(entries)
    const nodes: SceneNode[] = []
    const slots: SceneSlot[] = []
    const active = new Set(frame.activeIndices ?? [])
    const sorted = new Set(frame.sortedIndices ?? [])
    const sourceSlots = scene.slots ?? []
    for (let index = 0; index < entries.length; index += 1) {
      const buffered = Boolean(frame.buffer) && index >= (frame.writeIndex ?? 0) && index <= (frame.rangeEnd ?? -1)
      const empty = index === frame.hole || buffered
      const role = frame.roles?.[index]
      const highlighted = active.has(index) || role !== undefined
      const finalized = index < (frame.sortedPrefix ?? 0) || index >= (frame.sortedFrom ?? entries.length) || sorted.has(index)
      if (!empty) nodes.push({
        ...scene.nodes[index],
        tone: highlighted ? 'active' : finalized ? 'visited' : 'default',
        status: role ?? (active.has(index) ? 'COMPARE' : finalized ? 'SORTED' : undefined),
      })
      slots.push({ ...sourceSlots[index], empty, highlighted })
    }
    if (frame.output) {
      for (let index = 0; index < frame.output.length; index += 1) {
        const entry = frame.output[index]
        if (entry) nodes.push({ ...entry, id: `output-${entry.id}`, x: 80 + index * 92, y: 440, label: '', tone: 'visited', status: 'OUTPUT', opacity: 1 })
        slots.push({ id: `output-slot-${index}`, x: 80 + index * 92, y: 440, label: `output [${index}]`, empty: entry === null, highlighted: false, opacity: 1 })
      }
    }
    if (frame.buckets) {
      let position = 0
      for (let bucket = 0; bucket < frame.buckets.length; bucket += 1) {
        for (let index = 0; index < frame.buckets[bucket].length; index += 1) {
          const entry = frame.buckets[bucket][index]
          const x = 80 + position * 92 + bucket * 20
          const highlighted = bucket === frame.activeBucket && Boolean(frame.activeBucketIndices?.includes(index))
          nodes.push({ ...entry, id: `bucket-${entry.id}`, x, y: 440, label: '', tone: highlighted ? 'active' : 'visited', status: highlighted ? frame.bucketStatus ?? 'COMPARE' : 'BUCKET', opacity: 1 })
          slots.push({ id: `bucket-slot-${bucket}-${index}`, x, y: 440, label: `bucket ${bucket} [${index}]`, empty: false, highlighted, opacity: 1 })
          position += 1
        }
      }
    }
    for (let index = 0; index < (frame.counters?.length ?? 0); index += 1) {
      const counter = frame.counters![index]
      const x = 80 + index * 112
      nodes.push({ id: `counter-${counter.label}`, value: counter.count, x, y: 620, label: '', tone: counter.active ? 'active' : 'visited', status: counter.status, opacity: 1 })
      slots.push({ id: `counter-slot-${counter.label}`, x, y: 620, label: counter.label, empty: false, highlighted: counter.active, opacity: 1 })
    }
    if (frame.held) nodes.push({
      ...frame.held,
      x: 80 + (frame.hole ?? 0) * 92,
      y: 160,
      label: '',
      tone: 'active',
      status: 'HELD',
      opacity: 1,
    })
    if (frame.buffer) {
      const start = frame.bufferStart ?? 0
      for (let offset = 0; offset < frame.buffer.length; offset += 1) {
        const index = start + offset
        const reading = frame.activeBufferIndex === index || frame.otherBufferIndex === index
        nodes.push({
          ...frame.buffer[offset],
          id: `buffer-${frame.buffer[offset].id}`,
          x: 80 + index * 92,
          y: 440,
          label: '',
          tone: reading ? 'active' : 'visited',
          status: reading ? 'READ' : 'COPY',
          opacity: 1,
        })
        slots.push({ id: `buffer-slot-${index}`, x: 80 + index * 92, y: 440, label: `buffer [${index}]`, empty: false, highlighted: reading, opacity: 1 })
      }
    }
    let focusId: string | null = frame.held?.id ?? null
    for (const node of nodes) {
      if (node.tone === 'active') { focusId = node.id; break }
    }
    return {
      ...scene, nodes, slots, focusId,
      width: frame.distribution ? Math.max(scene.width, 160 + entries.length * 92 + Math.max(10, entries.length) * 20, 160 + Math.max(10, entries.length) * 112) : scene.width,
      height: frame.distribution ? 780 : 600,
      hint: frame.counterHint ? { title: 'Auxiliary storage', description: frame.counterHint } : undefined,
    }
  }
}
