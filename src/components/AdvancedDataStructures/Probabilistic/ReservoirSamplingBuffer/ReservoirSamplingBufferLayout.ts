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
    return LinearScene.create(model, nodes, [], frame, 'stream occurrences observed')
  }
}
