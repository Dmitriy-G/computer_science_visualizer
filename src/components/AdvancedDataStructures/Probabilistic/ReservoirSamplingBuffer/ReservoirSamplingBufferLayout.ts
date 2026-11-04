import { ReservoirSamplingBuffer } from './ReservoirSamplingBuffer.ts'
import { LinearScene } from '../../../../visualization/LinearScene.ts'
import { ProbabilisticScene } from '../../../../visualization/ProbabilisticScene.ts'
import type { LinearModel, LinearFrame } from '../../../../visualization/LinearModel.ts'
import type { Scene } from '../../../../visualization/Scene.ts'

export class ReservoirSamplingBufferLayout {
  public create(source: LinearModel, frame: LinearFrame = {}): Scene {
    const model = source as ReservoirSamplingBuffer
    const sample = model.getSample()
    const width = ProbabilisticScene.width([String(model.length), ...sample.map((entry) => String(entry.value))], [], 220)
    const nodes = [ProbabilisticScene.cell('stream-count', String(model.length), 'stream occurrences observed', 0, 0, width)]
    for (let slot = 0; slot < 5; slot += 1) {
      const entry = sample[slot]
      nodes.push(ProbabilisticScene.cell(entry?.id ?? `empty-sample-${slot}`, entry ? String(entry.value) : 'empty', `slot ${slot}${entry ? ` · arrival ${entry.arrival}` : ''}`, slot % 3, 1 + Math.floor(slot / 3), width))
    }
    return LinearScene.create(model, nodes, [], frame, {
      title: 'Algorithm R · five retained stream occurrences',
      description: 'Fill five slots, then draw j uniformly from 0 to seen − 1; replace slot j only if j < 5. Duplicates are separate arrivals. Under ideal random draws every occurrence has the same inclusion probability min(1, 5/seen). This lesson uses a fixed seeded PRNG with rejection sampling for reproducible decisions; it stores only retained values, a counter, and generator state. Clear restarts the seed.',
      code: 'seen += 1; if seen ≤ 5: append(value); else: j = uniform(0, seen - 1); if j < 5: sample[j] = value',
    }, 'stream occurrences observed')
  }
}
