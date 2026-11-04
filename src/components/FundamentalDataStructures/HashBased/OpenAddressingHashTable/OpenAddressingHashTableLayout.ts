import { OpenAddressingHashTable } from './OpenAddressingHashTable.ts'
import { HashTableScene } from '../../../../visualization/HashTableScene.ts'
import type { LinearModel, LinearFrame } from '../../../../visualization/LinearModel.ts'
import type { Scene } from '../../../../visualization/Scene.ts'

export class OpenAddressingHashTableLayout {
  public create(model: LinearModel, frame: LinearFrame = {}): Scene {
    if (!(model instanceof OpenAddressingHashTable)) throw new TypeError('Expected open addressing table')
    return HashTableScene.grid(model, [{ prefix: `${model.kind}-slot`, role: 'slot', slots: model.getSlots() }], frame, {
      title: 'Linear probing with tombstones', code: 'home = normalizedModulo(key, b); probe(d) = (home + d) mod b',
      description: `All records live inside ${model.capacity} physical slots. Lookup stops at EMPTY, continues through DELETED, and wraps at the end. New keys reuse deleted slots; growth occurs above 0.75 live load.`,
    })
  }
}
