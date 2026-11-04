import { QuotientFilter } from './QuotientFilter.ts'
import { LinearScene } from '../../../../visualization/LinearScene.ts'
import { ProbabilisticScene } from '../../../../visualization/ProbabilisticScene.ts'
import type { LinearModel, LinearFrame } from '../../../../visualization/LinearModel.ts'
import type { Scene } from '../../../../visualization/Scene.ts'

export class QuotientFilterLayout {
  public create(source: LinearModel, frame: LinearFrame = {}): Scene {
    const model = source as QuotientFilter
    const nodes = model.getSlots().map((slot, index) => ProbabilisticScene.cell(`qslot-${index}`, slot.remainder === null ? 'empty' : String(slot.remainder), `slot ${index} · O${+slot.occupied} C${+slot.continuation} S${+slot.shifted}`, index % 4, Math.floor(index / 4), 190))
    return LinearScene.create(model, nodes, [], frame, {
      title: '4 quotient bits + 8 remainder bits · 16 circular slots',
      description: 'O marks a canonical quotient with a run; C continues the previous run; S marks a remainder displaced from its canonical slot. Lookup walks real cluster/run metadata. Insertion rebuilds packed runs from stored fingerprints, without retaining keys; this teaching variant is slower than incremental shifting. Fifteen occurrences leave one empty sentinel. Fingerprint collisions allow false positives; deletion is not offered.',
      code: 'fingerprint = hash64(value) & 4095; quotient = fingerprint >> 8; remainder = fingerprint & 255',
    }, 'fingerprint occurrences')
  }
}
