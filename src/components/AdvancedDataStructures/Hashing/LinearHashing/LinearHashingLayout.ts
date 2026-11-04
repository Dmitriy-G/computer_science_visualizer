import { LinearHashing } from './LinearHashing.ts'
import { LinearScene } from '../../../../visualization/LinearScene.ts'
import { HashTableScene } from '../../../../visualization/HashTableScene.ts'
import type { LinearModel, LinearFrame } from '../../../../visualization/LinearModel.ts'
import type { Scene, SceneNode, SceneEdge } from '../../../../visualization/Scene.ts'

export class LinearHashingLayout {
  public create(model: LinearModel, frame: LinearFrame = {}): Scene {
    if (!(model instanceof LinearHashing)) throw new TypeError('Expected linear hashing model')
    const nodes: SceneNode[] = []
    const edges: SceneEdge[] = []
    const pages = model.getPages()
    let width = 180
    for (const record of model.getRecords()) width = Math.max(width, HashTableScene.display(record).length * 10 + 24)
    let rowY = 80
    for (let first = 0; first < model.bucketCount; first += 4) {
      let rowPages = 1
      for (let bucket = first; bucket < Math.min(first + 4, model.bucketCount); bucket += 1) {
        let depth = 0
        const x = 70 + width / 2 + (bucket - first) * (width + 80)
        for (const page of pages) {
          if (page.bucket !== bucket) continue
          const y = rowY + depth * 470
          const role = page.overflow ? 'overflow page' : `primary bucket ${bucket}${bucket === model.splitPointer ? '; NEXT SPLIT' : ''}`
          nodes.push(LinearScene.node(page.id, `B${bucket}${page.overflow ? ` / +${depth}` : ''}`, role, x, y, width))
          for (let slot = 0; slot < page.records.length; slot += 1) {
            const record = page.records[slot]
            nodes.push(HashTableScene.record(record, `page slot ${slot}`, x, y + (slot + 1) * 105))
            edges.push(LinearScene.edge(page.id, record.id, `slot ${slot}`))
          }
          if (page.nextId) edges.push(LinearScene.edge(page.id, page.nextId, 'overflow'))
          depth += 1
        }
        rowPages = Math.max(rowPages, depth)
      }
      rowY += rowPages * 470 + 100
    }
    return LinearScene.create(model, nodes, edges, frame, { title: 'Linear growth through a split pointer',
      code: `b = hash(key) mod ${model.roundBase}; if b < ${model.splitPointer}: b = hash(key) mod ${2 * model.roundBase}`,
      description: 'Three-record primary pages have linked overflow pages. Above 0.75 primary-page load, split exactly the next pointed bucket and advance the pointer, regardless of which bucket overflowed. The modulus doubles only after a complete split round. No directory is stored; deletion does not shrink the table.',
    }, 'entries')
  }
}
