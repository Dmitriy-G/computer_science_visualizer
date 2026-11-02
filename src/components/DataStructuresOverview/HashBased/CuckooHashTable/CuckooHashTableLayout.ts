import { CuckooHashTable } from './CuckooHashTable.ts'
import { HashTableScene } from '../../../../visualization/HashTableScene.ts'
import type { LinearModel, LinearFrame } from '../../../../visualization/LinearModel.ts'
import type { Scene } from '../../../../visualization/Scene.ts'

export class CuckooHashTableLayout {
  public create(model: LinearModel, frame: LinearFrame = {}): Scene {
    if (!(model instanceof CuckooHashTable)) throw new TypeError('Expected cuckoo table')
    const tables = model.getTables()
    return HashTableScene.grid(model, [
      { prefix: `${model.kind}-slot-0`, role: 'T0 slot', slots: tables[0] },
      { prefix: `${model.kind}-slot-1`, role: 'T1 slot', slots: tables[1] },
    ], frame, { title: 'Two-choice cuckoo placement', code: `h_t(key) = ((a_t × normalizedKey + c_t) mod (2^61 - 1)) mod ${model.capacity}`,
      description: `Seed ${model.hashSeed} selects two deterministic affine hash functions. Each record has one legal location in each table. Kicks alternate tables; an evicted record is held explicitly. Up to eight larger-table rebuilds are tried before rejecting unchanged. This is single-threaded.`,
    }, model.getHeld())
  }
}
