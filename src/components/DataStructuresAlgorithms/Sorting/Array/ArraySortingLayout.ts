import { ArrayLayout } from '../../../FundamentalDataStructures/Linear/Array/ArrayLayout.ts'
import type { ArrayEntry } from '../../../FundamentalDataStructures/Linear/Array/FixedArray.ts'
import type { ArraySortFrame, ArraySortRun, ArraySortTreeNode } from './ArraySortTrace.ts'
import type { Scene, SceneEdge, SceneNode, SceneSlot } from '../../../../visualization/Scene.ts'

export class ArraySortingLayout {
  public create(entries: readonly ArrayEntry[], frame: ArraySortFrame = {}): Scene {
    const scene = new ArrayLayout().create(entries)
    const nodes: SceneNode[] = []
    const slots: SceneSlot[] = []
    const edges: SceneEdge[] = []
    let width = scene.width
    let height = frame.sampleSort ? 1140 : frame.distribution ? 780 : 600
    const active = new Set(frame.activeIndices ?? [])
    const sorted = new Set(frame.sortedIndices ?? [])
    const sourceSlots = scene.slots ?? []
    for (let index = 0; index < entries.length; index += 1) {
      const buffered = Boolean(frame.buffer) && index >= (frame.writeIndex ?? 0) && index <= (frame.rangeEnd ?? -1)
      const empty = index === frame.hole || index >= (frame.unwrittenFrom ?? entries.length) || buffered
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
    if (frame.shelf) {
      for (let index = 0; index < frame.shelf.length; index += 1) {
        const entry = frame.shelf[index]
        const x = 80 + index * 92
        const active = Boolean(frame.shelfActiveIndices?.includes(index))
        if (entry) nodes.push({ ...entry, id: `shelf-${entry.id}`, x, y: 440, label: '', tone: active ? 'active' : 'visited', status: active ? 'SELECTED' : 'BOOK', opacity: 1 })
        slots.push({ id: `shelf-slot-${index}`, x, y: 440, label: `shelf [${index}]`, empty: entry === null, highlighted: active, opacity: 1 })
        width = Math.max(width, x + 120)
      }
    }
    if (frame.output) {
      const y = frame.sampleSort ? 980 : 440
      for (let index = 0; index < frame.output.length; index += 1) {
        const entry = frame.output[index]
        if (entry) nodes.push({ ...entry, id: `output-${entry.id}`, x: 80 + index * 92, y, label: '', tone: 'visited', status: 'OUTPUT', opacity: 1 })
        slots.push({ id: `output-slot-${index}`, x: 80 + index * 92, y, label: `output [${index}]`, empty: entry === null, highlighted: false, opacity: 1 })
      }
    }
    for (const auxiliary of ['samples', 'splitters'] as const) {
      const values = frame[auxiliary] ?? []
      const sample = auxiliary === 'samples'
      const y = sample ? 440 : 620
      for (let index = 0; index < values.length; index += 1) {
        const entry = values[index]
        const highlighted = sample ? Boolean(frame.activeSampleIndices?.includes(index)) : frame.activeSplitter === index
        const x = 80 + index * 112
        nodes.push({ ...entry, id: sample ? `sample-${entry.id}` : `splitter-${index}-${entry.id}`, x, y, label: '', tone: highlighted ? 'active' : 'visited', status: highlighted && sample ? 'COMPARE' : sample ? 'SAMPLE' : 'SPLITTER', opacity: 1 })
        slots.push({ id: `${auxiliary}-slot-${index}`, x, y, label: `${sample ? 'sample' : 'splitter'} [${index}]`, empty: false, highlighted, opacity: 1 })
        width = Math.max(width, x + 120)
      }
    }
    if (frame.buckets) {
      let position = 0
      for (let bucket = 0; bucket < frame.buckets.length; bucket += 1) {
        for (let index = 0; index < frame.buckets[bucket].length; index += 1) {
          const entry = frame.buckets[bucket][index]
          const x = frame.piles ? 80 + bucket * 112 : 80 + position * 92 + bucket * 20
          const y = frame.piles ? 620 + (frame.buckets[bucket].length - 1 - index) * 140 : frame.sampleSort ? 800 : 440
          const top = index === frame.buckets[bucket].length - 1
          const highlighted = bucket === frame.activeBucket && Boolean(frame.activeBucketIndices?.includes(index)) || Boolean(frame.activePileTops?.includes(bucket)) && top
          const status = frame.piles ? top ? 'TOP' : 'PILE' : 'BUCKET'
          nodes.push({ ...entry, id: `bucket-${entry.id}`, x, y, label: '', tone: highlighted ? 'active' : 'visited', status: highlighted ? frame.bucketStatus ?? 'COMPARE' : status, opacity: 1 })
          slots.push({ id: `bucket-slot-${bucket}-${index}`, x, y, label: `${frame.piles ? 'pile' : 'bucket'} ${bucket} [${index}]`, empty: false, highlighted, opacity: 1 })
          if (frame.piles) height = Math.max(height, y + 160)
          position += 1
        }
      }
    }
    for (let index = 0; index < (frame.counters?.length ?? 0); index += 1) {
      const counter = frame.counters![index]
      const x = 80 + index * 112
      nodes.push({ id: `counter-${counter.label}`, value: counter.count, x, y: 620, label: '', tone: counter.active ? 'active' : 'visited', status: counter.status, opacity: 1 })
      slots.push({ id: `counter-slot-${counter.label}`, x, y: 620, label: counter.label, empty: false, highlighted: counter.active, opacity: 1 })
      width = Math.max(width, x + 120)
      height = Math.max(height, 780)
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
    if (frame.tree && frame.treeRoot) {
      const tree = new Map<string, ArraySortTreeNode>()
      for (const node of frame.tree) tree.set(node.id, node)
      const pending: { id: string, depth: number, visit: boolean }[] = [{ id: frame.treeRoot, depth: 0, visit: false }]
      let column = 0
      while (pending.length) {
        const item = pending.pop()!
        const node = tree.get(item.id)!
        if (!item.visit) {
          if (node.right) pending.push({ id: node.right, depth: item.depth + 1, visit: false })
          pending.push({ ...item, visit: true })
          if (node.left) pending.push({ id: node.left, depth: item.depth + 1, visit: false })
          continue
        }
        const x = 80 + column++ * 92
        const y = 640 + item.depth * 120
        const id = `sort-tree-${node.id}`
        nodes.push({ id, value: node.entry?.value ?? 0, displayValue: node.entry ? undefined : '∅', x, y, label: '', tone: node.active ? 'active' : 'visited', status: node.status, opacity: 1 })
        for (const child of [node.left, node.right]) {
          if (child) edges.push({ id: `sort-edge-${node.id}-${child}`, from: id, to: `sort-tree-${child}`, directed: true, highlighted: node.active || tree.get(child)!.active, opacity: 1 })
        }
        width = Math.max(width, x + 120)
        height = Math.max(height, y + 160)
      }
    }
    if (frame.trie) {
      const columns = new Map<number, number>()
      for (const node of frame.trie) {
        const depth = node.prefix.length
        const column = columns.get(depth) ?? 0
        columns.set(depth, column + 1)
        const x = 80 + column * 132
        const y = 640 + depth * 150
        const id = `trie-${node.id}`
        nodes.push({ id, value: node.count, displayValue: node.prefix.slice(-1) || 'root', x, y, label: `size ${node.count}`, tone: node.active ? 'active' : 'visited', status: node.terminal ? 'TERMINAL' : node.leaf ? 'CONTAINER' : 'TRIE NODE', opacity: 1 })
        if (node.parent) edges.push({ id: `trie-edge-${node.id}`, from: `trie-${node.parent}`, to: id, directed: true, highlighted: node.active, opacity: 1 })
        width = Math.max(width, x + 140)
        height = Math.max(height, y + 160)
      }
    }
    if (frame.storage) {
      for (let row = 0; row < frame.storage.length; row += 1) {
        const storage = frame.storage[row]
        const y = (frame.trie ? 820 + (frame.trieDepth ?? 0) * 150 : 640) + row * 180
        let column = 2
        nodes.push({ id: `storage-heading-${storage.id}`, value: 0, displayValue: storage.label, x: 80, y, label: storage.id === 'ram' ? '≤3 RECORDS' : storage.status, tone: 'visited', status: 'STORAGE', opacity: 1 })
        const runs: readonly ArraySortRun[] = storage.runs.length ? storage.runs : [{ id: `${storage.id}-empty`, label: 'empty', entries: [], status: 'EMPTY' }]
        for (const run of runs) {
          const length = Math.max(1, run.entries.length)
          for (let index = 0; index < length; index += 1) {
            const entry = run.entries[index]
            const x = 80 + column++ * 112
            const reading = run.cursor === index || Boolean(run.activeIndices?.includes(index))
            const status = run.dummy ? 'DUMMY' : reading ? 'READ' : index < (run.cursor ?? 0) ? 'CONSUMED' : run.status
            nodes.push({ id: `storage-${run.id}-${entry?.id ?? 'empty'}`, value: entry?.value ?? 0, displayValue: entry ? undefined : '∅', x, y, label: '', tone: reading ? 'active' : 'visited', status, opacity: 1 })
            slots.push({ id: `storage-slot-${storage.id}-${run.id}-${index}`, x, y, label: `${run.label} [${index}]`, empty: false, highlighted: reading, opacity: 1 })
            width = Math.max(width, x + 140)
          }
          column += 1
        }
        height = Math.max(height, y + 170)
      }
    }
    if (frame.tasks) {
      const depths = new Map<string, number>()
      const columns = new Map<number, number>()
      for (const task of frame.tasks) {
        const depth = task.parent === null ? 0 : (depths.get(task.parent) ?? 0) + 1
        depths.set(task.id, depth)
        const column = columns.get(depth) ?? 0
        columns.set(depth, column + 1)
        const x = 80 + column * 132
        const y = 640 + depth * 150
        const active = task.status === 'RUN'
        nodes.push({ id: `task-${task.id}`, value: task.end - task.start, displayValue: `${task.start}:${task.end}`, x, y, label: task.kind, tone: active ? 'active' : 'visited', status: `${task.status}${active ? ` W${task.worker}` : ''}`, opacity: 1 })
        if (task.parent !== null) edges.push({ id: `task-edge-${task.id}`, from: `task-${task.parent}`, to: `task-${task.id}`, directed: true, highlighted: active, opacity: 1 })
        width = Math.max(width, x + 150)
        height = Math.max(height, y + 160)
      }
    }
    if (frame.comparator) {
      const { first, second, ascending } = frame.comparator
      edges.push({ id: 'array-comparator', from: entries[first].id, to: entries[second].id, directed: false, highlighted: true, opacity: 1, bend: 88, label: ascending ? 'ASC' : 'DESC' })
    }
    let focusId: string | null = frame.held?.id ?? null
    for (const node of nodes) {
      if (node.tone === 'active') { focusId = node.id; break }
    }
    return {
      ...scene, nodes, edges, slots, focusId,
      width: frame.distribution ? Math.max(width, 160 + entries.length * 92 + Math.max(10, entries.length) * 20, 160 + Math.max(10, entries.length) * 112) : width,
      height,
      hint: frame.counterHint ? { title: 'Auxiliary storage', description: frame.counterHint } : undefined,
    }
  }
}
