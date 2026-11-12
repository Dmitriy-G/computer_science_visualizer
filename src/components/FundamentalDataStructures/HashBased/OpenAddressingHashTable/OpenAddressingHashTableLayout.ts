import { OpenAddressingHashTable } from './OpenAddressingHashTable.ts'
import { HashTableScene } from '../../../../visualization/HashTableScene.ts'
import type { LinearModel, LinearFrame } from '../../../../visualization/LinearModel.ts'
import type { Scene } from '../../../../visualization/Scene.ts'

export class OpenAddressingHashTableLayout {
  public create(model: LinearModel, frame: LinearFrame = {}): Scene {
    if (!(model instanceof OpenAddressingHashTable)) throw new TypeError('Expected open addressing table')
    return HashTableScene.grid(model, [{ prefix: `${model.kind}-slot`, role: 'slot', slots: model.getSlots() }], frame)
  }
}
