import { SeparateChainingHashTable } from './SeparateChainingHashTable.ts'
import { LinearScene } from '../../../../visualization/LinearScene.ts'
import { HashTableScene } from '../../../../visualization/HashTableScene.ts'
import type { LinearModel, LinearFrame } from '../../../../visualization/LinearModel.ts'
import type { Scene, SceneNode, SceneEdge } from '../../../../visualization/Scene.ts'

export class SeparateChainingHashTableLayout {
  public create(model: LinearModel, frame: LinearFrame = {}): Scene {
    if (!(model instanceof SeparateChainingHashTable)) throw new TypeError('Expected separate chaining table')
    const nodes: SceneNode[] = []
    const edges: SceneEdge[] = []
    const entries = model.getEntries()
    let width = 180
    for (const entry of entries) width = Math.max(width, HashTableScene.display(entry).length * 10 + 24)
    const pitch = width + 70
    let rowY = 80
    for (let first = 0; first < model.bucketCount; first += 4) {
      let maximumDepth = 0
      for (let bucket = first; bucket < Math.min(first + 4, model.bucketCount); bucket += 1) {
        const x = 70 + width / 2 + (bucket - first) * pitch
        const id = `${model.kind}-bucket-${bucket}`
        nodes.push(LinearScene.node(id, String(bucket), 'bucket head', x, rowY, width))
        let previous = id
        let depth = 0
        for (const entry of entries) {
          if (entry.bucket !== bucket) continue
          depth += 1
          nodes.push(HashTableScene.record(entry, `chain index ${depth - 1}`, x, rowY + depth * 125))
          edges.push(LinearScene.edge(previous, entry.id, previous === id ? 'head' : 'next'))
          previous = entry.id
        }
        maximumDepth = Math.max(maximumDepth, depth)
      }
      rowY += Math.max(1, maximumDepth) * 125 + 150
    }
    return LinearScene.create(model, nodes, edges, frame, { title: 'Separate collision chains', code: `bucket = normalizedModulo(key, ${model.bucketCount})`,
      description: 'Each bucket points to an actual singly linked collision chain. Insertion links at the head; deletion reconnects neighbors. Above 0.75 load, double the buckets and relink the same records. This entry reuses the existing Hash Map’s canonical chaining model.',
    }, 'entries')
  }
}
