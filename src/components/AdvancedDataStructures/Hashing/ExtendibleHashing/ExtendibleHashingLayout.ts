import { ExtendibleHashing } from './ExtendibleHashing.ts'
import { LinearScene } from '../../../../visualization/LinearScene.ts'
import { HashTableScene } from '../../../../visualization/HashTableScene.ts'
import type { LinearModel, LinearFrame } from '../../../../visualization/LinearModel.ts'
import type { Scene, SceneNode, SceneEdge } from '../../../../visualization/Scene.ts'

export class ExtendibleHashingLayout {
  public create(model: LinearModel, frame: LinearFrame = {}): Scene {
    if (!(model instanceof ExtendibleHashing)) throw new TypeError('Expected extendible hashing model')
    const nodes: SceneNode[] = []
    const edges: SceneEdge[] = []
    const directory = model.getDirectory()
    const buckets = model.getBuckets()
    let recordWidth = 180
    for (const record of model.getRecords()) recordWidth = Math.max(recordWidth, HashTableScene.display(record).length * 10 + 24)
    for (let index = 0; index < directory.length; index += 1) {
      const id = `${model.kind}-directory-${index}`
      nodes.push(LinearScene.node(id, index.toString(2).padStart(Math.max(1, model.globalDepth), '0'), `directory ${index}`, 130 + (index % 8) * 160, 80 + Math.floor(index / 8) * 120, 110))
      edges.push(LinearScene.edge(id, directory[index], 'bucket alias'))
    }
    let firstY = 240 + Math.ceil(directory.length / 8) * 120
    for (let first = 0; first < buckets.length; first += 4) {
      for (let index = first; index < Math.min(first + 4, buckets.length); index += 1) {
        const bucket = buckets[index]
        const x = 70 + recordWidth / 2 + (index - first) * (recordWidth + 80)
        nodes.push(LinearScene.node(bucket.id, `B${bucket.id.split('-').at(-1)}`, `local depth ${bucket.depth}; capacity 3`, x, firstY, recordWidth))
        for (let slot = 0; slot < bucket.records.length; slot += 1) {
          const record = bucket.records[slot]
          nodes.push(HashTableScene.record(record, `bucket slot ${slot}`, x, firstY + 115 * (slot + 1)))
          edges.push(LinearScene.edge(bucket.id, record.id, `slot ${slot}`))
        }
      }
      firstY += 510
    }
    return LinearScene.create(model, nodes, edges, frame, 'entries')
  }
}
