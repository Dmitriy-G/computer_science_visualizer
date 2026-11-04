import { HopscotchHashing } from './HopscotchHashing.ts'
import { HashTableScene } from '../../../../visualization/HashTableScene.ts'
import type { LinearModel, LinearFrame } from '../../../../visualization/LinearModel.ts'
import type { Scene } from '../../../../visualization/Scene.ts'

export class HopscotchHashingLayout {
  public create(model: LinearModel, frame: LinearFrame = {}): Scene {
    if (!(model instanceof HopscotchHashing)) throw new TypeError('Expected hopscotch table')
    const slots = model.getSlots()
    const bits = model.getHopBits()
    const labels: string[] = []
    const recordLabels: string[] = []
    for (let index = 0; index < slots.length; index += 1) {
      labels.push(`hop bits ${bits[index].toString(2).padStart(4, '0')}`)
      const record = slots[index]
      recordLabels.push(record ? `home ${model.home(record.key)}; offset ${(index - model.home(record.key) + model.capacity) % model.capacity}` : '')
    }
    return HashTableScene.grid(model, [{ prefix: `${model.kind}-slot`, role: 'slot / home', slots, labels, recordLabels }], frame, {
      title: 'Four-position hop neighborhoods', code: 'home = normalizedModulo(key, b); bit d means slot[(home + d) mod b] belongs to home',
      description: 'The rightmost bitmap bit is offset zero. A bitmap belongs to the home index, independently of the record occupying that slot. Legal hops bring a free slot closer while preserving each moved record’s four-slot neighborhood. Growth is capped at 256 slots; failed placement is rolled back.',
    })
  }
}
