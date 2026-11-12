import { CuckooFilter } from './CuckooFilter.ts'
import { LinearScene } from '../../../../visualization/LinearScene.ts'
import { ProbabilisticScene } from '../../../../visualization/ProbabilisticScene.ts'
import type { LinearModel, LinearFrame } from '../../../../visualization/LinearModel.ts'
import type { Scene, SceneNode } from '../../../../visualization/Scene.ts'

export class CuckooFilterLayout {
  public create(source: LinearModel, frame: LinearFrame = {}): Scene {
    const model = source as CuckooFilter
    const nodes: SceneNode[] = []
    const buckets = model.getBuckets()
    for (let bucket = 0; bucket < 8; bucket += 1) {
      for (let slot = 0; slot < 2; slot += 1) nodes.push(ProbabilisticScene.cell(`bucket-${bucket}-${slot}`, buckets[bucket][slot] === null ? 'empty' : String(buckets[bucket][slot]), `bucket ${bucket} · slot ${slot}`, bucket % 4, Math.floor(bucket / 4) * 2 + slot))
    }
    return LinearScene.create(model, nodes, [], frame, 'live fingerprint occurrences')
  }
}
