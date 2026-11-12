import { QuotientFilter } from './QuotientFilter.ts'
import { LinearScene } from '../../../../visualization/LinearScene.ts'
import { ProbabilisticScene } from '../../../../visualization/ProbabilisticScene.ts'
import type { LinearModel, LinearFrame } from '../../../../visualization/LinearModel.ts'
import type { Scene } from '../../../../visualization/Scene.ts'

export class QuotientFilterLayout {
  public create(source: LinearModel, frame: LinearFrame = {}): Scene {
    const model = source as QuotientFilter
    const nodes = model.getSlots().map((slot, index) => ProbabilisticScene.cell(`qslot-${index}`, slot.remainder === null ? 'empty' : String(slot.remainder), `slot ${index} · O${+slot.occupied} C${+slot.continuation} S${+slot.shifted}`, index % 4, Math.floor(index / 4), 190))
    return LinearScene.create(model, nodes, [], frame, 'fingerprint occurrences')
  }
}
