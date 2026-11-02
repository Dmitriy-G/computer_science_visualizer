import { PerfectHashTable } from './PerfectHashTable.ts'
import { LinearScene } from '../../../../visualization/LinearScene.ts'
import { HashTableScene } from '../../../../visualization/HashTableScene.ts'
import type { LinearModel, LinearFrame } from '../../../../visualization/LinearModel.ts'
import type { Scene, SceneNode, SceneEdge } from '../../../../visualization/Scene.ts'

export class PerfectHashTableLayout {
  public create(model: LinearModel, frame: LinearFrame = {}): Scene {
    if (!(model instanceof PerfectHashTable)) throw new TypeError('Expected perfect hash table')
    const nodes: SceneNode[] = []
    const edges: SceneEdge[] = []
    const buckets = model.getBuckets()
    const work = model.getBuildView()
    let width = 180
    for (const record of model.getRecords()) width = Math.max(width, String(record.key).length * 10 + 24)
    for (const record of work?.trialSlots ?? []) if (record) width = Math.max(width, String(record.key).length * 10 + 24)
    if (work && work.collisionKey !== null) width = Math.max(width, String(work.collisionKey).length * 10 + 24)
    let rowY = 80
    for (let first = 0; first < buckets.length; first += 4) {
      let maximumSlots = 0
      for (let bucket = first; bucket < Math.min(first + 4, buckets.length); bucket += 1) {
        const secondary = buckets[bucket]
        const x = 70 + width / 2 + (bucket - first) * (2 * width + 130)
        const id = `${model.kind}-bucket-${bucket}`
        nodes.push(LinearScene.node(id, String(bucket), `primary; h2 seed ${secondary.seed}; ${secondary.slots.length} cells`, x + width / 2, rowY, width + 60))
        for (let index = 0; index < secondary.slots.length; index += 1) {
          const record = secondary.slots[index]
          const slotId = `${model.kind}-slot-${bucket}-${index}`
          const slotX = x + (index % 2) * (width + 50)
          const slotY = rowY + 145 + Math.floor(index / 2) * 215
          nodes.push(LinearScene.node(slotId, String(index), record ? 'secondary occupied' : 'secondary empty', slotX, slotY, width))
          edges.push(LinearScene.edge(id, slotId, 'h2 slot'))
          if (record) nodes.push(LinearScene.node(record.id, String(record.key), 'stored key; compare for membership', slotX, slotY + 85, width))
        }
        maximumSlots = Math.max(maximumSlots, secondary.slots.length)
      }
      rowY += 220 + Math.ceil(maximumSlots / 2) * 215
    }
    if (work) {
      const firstY = rowY + 100
      for (let bucket = 0; bucket < work.bucketSizes.length; bucket += 1) {
        nodes.push(LinearScene.node(`${model.kind}-candidate-bucket-${bucket}`, String(work.bucketSizes[bucket]), `trial bucket ${bucket}; key count`,
          130 + (bucket % 8) * 180, firstY + Math.floor(bucket / 8) * 130, 140))
      }
      const trialY = firstY + Math.ceil(work.bucketSizes.length / 8) * 130 + 100
      for (let index = 0; index < work.trialSlots.length; index += 1) {
        const record = work.trialSlots[index]
        const slotId = `${model.kind}-candidate-slot-${index}`
        const x = 100 + width / 2 + (index % 4) * (width + 80)
        const y = trialY + Math.floor(index / 4) * 210
        nodes.push(LinearScene.node(slotId, String(index), index === work.collisionIndex ? 'candidate COLLISION' : 'candidate secondary cell', x, y, width))
        edges.push(LinearScene.edge(`${model.kind}-candidate-bucket-${work.activeBucket}`, slotId, 'trial h2 slot'))
        if (record) nodes.push(LinearScene.node(`${model.kind}-candidate-copy-${record.id}`, String(record.key), 'candidate key copy', x, y + 85, width))
      }
      if (work.collisionKey !== null) nodes.push(LinearScene.node(`${model.kind}-candidate-collision`, String(work.collisionKey), 'candidate key cannot fit this seed', 100 + width / 2,
        trialY + Math.ceil(work.trialSlots.length / 4) * 210 + 80, Math.max(width, String(work.collisionKey).length * 10 + 24)))
    }
    return LinearScene.create(model, nodes, edges, frame, { title: 'Static two-level FKS perfect hashing',
      code: `committed h1 seed ${model.primarySeed}; candidate h1 seed ${work?.primarySeed ?? 'none'}; secondary size = s²`,
      description: 'Build a complete static set of distinct keys. Primary trials require the sum of squared bucket sizes to be at most 4n; secondary trials eliminate collisions. Candidate buckets and key copies appear below the committed table during construction, then replace it only after success. Each lookup verifies the full key. Seed trials are capped at 128 per level; this is not a minimal perfect table.',
    }, 'keys')
  }
}
