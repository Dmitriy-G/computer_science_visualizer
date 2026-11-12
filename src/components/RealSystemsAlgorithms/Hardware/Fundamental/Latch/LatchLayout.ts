import { HardwareDiagram } from '../../../../../visualization/HardwareDiagram.ts'
import { CpuModel } from '../CpuModel.ts'
import type { LatchModel } from './LatchModel.ts'

export class LatchLayout {
  public static create(model: LatchModel): CpuModel {
    const diagram = new HardwareDiagram(1060, 760)
    diagram.region('latch', 'Level-sensitive D latch / one powered bit', 'memory', 30, 35, 1000, 400)
      .fixture('data', 'Data input D', String(model.data), 165, 170)
      .fixture('enable', 'Latch enable LE', model.enabled ? '1 / transparent' : '0 / hold', 165, 335)
      .fixture('stored', 'Stored Q', String(model.stored), 515, 170, model.enabled ? 'follows D' : 'retains bit')
      .fixture('output-enable', 'Output enable /OE', model.outputEnabled ? '0 / connected' : '1 / high Z', 515, 335)
      .fixture('pin', 'External output', model.outputEnabled ? String(model.stored) : 'Z', 875, 170)
      .connect('capture', 'data', 'stored', 'transparent data path', model.enabled)
      .connect('gate', 'enable', 'stored', 'level control', model.enabled)
      .connect('drive', 'stored', 'pin', 'output buffer', model.outputEnabled)
      .connect('output-control', 'output-enable', 'pin', 'buffer control')
    diagram.region('waveforms', 'Sample history / equal spacing is not elapsed time', 'observer', 30, 465, 1000, 265)
    const signals = ['D', 'LE', 'Q']
    for (let row = 0; row < signals.length; row += 1) {
      let path = ''
      const baseline = 530 + row * 75
      for (let index = 0; index < model.history.length; index += 1) {
        const sample = model.history[index]
        const bit = row === 0 ? sample.data : row === 1 ? Number(sample.enabled) : sample.stored
        const x = 185 + index * 95
        const y = baseline + (bit ? -16 : 16)
        path += index === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`
        path += ` L ${x + 95} ${y}`
      }
      diagram.fixture(`wave-${row}`, signals[row], row === 0 ? String(model.data) : row === 1 ? String(Number(model.enabled)) : String(model.stored), 95, baseline, undefined, 70)
      if (path) diagram.paths.push({ id: `waveform-${row}`, d: path, label: `${signals[row]} waveform; upper level is one, lower level is zero`, highlighted: row === 2 })
    }
    return new CpuModel([], 'stored', 0, diagram)
  }
}
