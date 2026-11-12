import type { HashTrace } from './Hashing.ts'
import type { Scene, SceneEdge, SceneNode } from './Scene.ts'

export interface HashBucketModel {
  readonly bucketCount: number
  readonly length: number
  getEntries(): readonly HashBucketEntry[]
}

interface HashBucketEntry {
  readonly id: string
  readonly key: number
  readonly value: number
  readonly bucket: number
}

export class HashBucketLayout {
  private readonly kind: 'hash-map' | 'hash-set'

  constructor(kind: 'hash-map' | 'hash-set') { this.kind = kind }

  public create(model: HashBucketModel, event?: HashTrace): Scene {
    const entries = model.getEntries()
    const nodes: SceneNode[] = []
    const edges: SceneEdge[] = []
    const columns = 4
    const spacing = this.kind === 'hash-map' ? 300 : 180
    let y = 80
    for (let first = 0; first < model.bucketCount; first += columns) {
      let rowDepth = 0
      for (let bucket = first; bucket < Math.min(first + columns, model.bucketCount); bucket += 1) {
        const x = 60 + spacing / 2 + (bucket - first) * spacing
        const bucketId = `${this.kind}-bucket-${bucket}`
        nodes.push({
          id: bucketId, value: bucket, x, y, width: 60, height: 46,
          label: 'BUCKET', tone: event?.bucket === bucket ? 'active' : 'default', opacity: 1,
        })
        let previous = bucketId
        let depth = 0
        for (const entry of entries) {
          if (entry.bucket !== bucket) continue
          depth += 1
          const active = event?.id === entry.id
          nodes.push({
            id: entry.id, value: entry.key, x, y: y + depth * 116,
            width: this.kind === 'hash-map' ? 240 : 110, height: 54,
            keys: this.kind === 'hash-map' ? [entry.key, entry.value] : undefined,
            label: this.kind === 'hash-map' ? 'KEY / VALUE' : 'VALUE',
            tone: active ? event?.type === 'insert' ? 'new' : 'active' : 'default',
            status: active ? event?.type === 'insert' ? 'NEW' : event?.type === 'result' && event.found ? 'FOUND' : event?.type === 'update' ? this.kind === 'hash-set' ? 'DUPLICATE' : 'UPDATED' : 'CURRENT' : undefined,
            opacity: 1,
          })
          edges.push({ id: `${previous}-${entry.id}`, from: previous, to: entry.id, directed: true, highlighted: active, opacity: 1 })
          previous = entry.id
        }
        rowDepth = Math.max(rowDepth, depth)
      }
      y += Math.max(1, rowDepth) * 116 + 130
    }
    return {
      kind: this.kind, nodes, edges, width: columns * spacing + 120,
      height: y, count: model.length,
      focusId: event?.id && event.type !== 'remove' ? event.id : event?.bucket !== undefined ? `${this.kind}-bucket-${event.bucket}` : null,
    }
  }
}
