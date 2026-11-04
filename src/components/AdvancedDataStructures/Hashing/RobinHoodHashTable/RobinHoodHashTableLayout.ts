import { RobinHoodHashTable } from './RobinHoodHashTable.ts'
import { HashTableScene } from '../../../../visualization/HashTableScene.ts'
import type { LinearModel, LinearFrame } from '../../../../visualization/LinearModel.ts'
import type { Scene } from '../../../../visualization/Scene.ts'

export class RobinHoodHashTableLayout {
  public create(model: LinearModel, frame: LinearFrame = {}): Scene {
    if (!(model instanceof RobinHoodHashTable)) throw new TypeError('Expected Robin Hood table')
    const slots = model.getSlots()
    const labels: string[] = []
    for (let index = 0; index < slots.length; index += 1) {
      const record = slots[index]
      labels.push(record && record !== 'deleted' ? `home ${model.home(record.key)}; distance ${model.distance(index, record.key)}` : '')
    }
    return HashTableScene.grid(model, [{ prefix: `${model.kind}-slot`, role: 'slot', slots, recordLabels: labels }], frame, {
      title: 'Robin Hood displacement', code: 'distance = (slot - home + b) mod b; swap when incoming.distance > resident.distance',
      description: 'Greater-distance arrivals displace less-traveled residents. A held record remains visible during swaps. Lookup can stop when a resident has a smaller distance than the search; deletion shifts the following cluster backward.',
    }, model.getHeld())
  }
}
