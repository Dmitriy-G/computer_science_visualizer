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
    return LinearScene.create(model, nodes, [], frame, {
      title: '8 buckets × 2 fingerprint slots',
      description: 'Buckets store eight-bit nonzero fingerprints, not keys. Compare both candidate buckets for approximate membership. This deterministic variant finds a relocation path by breadth-first search before modifying storage; failure preserves all fingerprints. An extra key ledger makes deletion safe and adds memory. Public fixed hash seeds support replay, not cryptographic use.',
      code: 'i1 = h(value) mod 8; i2 = i1 XOR (1 + h(fingerprint) mod 7)',
    }, 'live fingerprint occurrences')
  }
}
