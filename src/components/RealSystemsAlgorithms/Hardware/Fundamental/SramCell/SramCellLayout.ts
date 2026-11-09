import { HardwareDiagram } from '../../../../../visualization/HardwareDiagram.ts'
import { CpuModel } from '../CpuModel.ts'
import type { SramCellModel } from './SramCellModel.ts'

export class SramCellLayout {
  public static create(model: SramCellModel): CpuModel {
    const diagram = new HardwareDiagram(1280, 870)
    diagram.region('cell', 'Conventional 6T SRAM cell / four inverter transistors + two access transistors', 'memory', 30, 40, 850, 590)
      .fixture('wl', 'Word line', model.wordLine ? '1 / access on' : '0 / isolated', 450, 140)
      .fixture('bl', 'BL', model.bitLine, 170, 300)
      .fixture('bl-bar', 'BL complement', model.inverseBitLine, 740, 300)
      .fixture('access-left', 'Access transistor', model.wordLine ? 'on' : 'off', 170, 490)
      .fixture('access-right', 'Access transistor', model.wordLine ? 'on' : 'off', 740, 490)
      .fixture('q', 'Inverter A / Q', String(model.stored), 380, 300, 'stored node', 150)
      .fixture('q-bar', 'Inverter B / Q complement', String(1 - model.stored), 545, 490, 'stored node', 150)
      .connect('feedback-a', 'q', 'q-bar', 'invert / 2T', model.operation === 'hold', -35)
      .connect('feedback-b', 'q-bar', 'q', 'invert / 2T', model.operation === 'hold', -35)
      .connect('left-line', 'bl', 'access-left', 'bit line', model.wordLine)
      .connect('left-access', 'access-left', 'q', 'access', model.wordLine)
      .connect('right-line', 'bl-bar', 'access-right', 'bit line', model.wordLine)
      .connect('right-access', 'access-right', 'q-bar', 'access', model.wordLine)
      .connect('wl-left', 'wl', 'access-left', 'gate control')
      .connect('wl-right', 'wl', 'access-right', 'gate control')
    diagram.region('array', 'Small array / selected cell R0 C0', 'memory', 920, 40, 330, 590)
    for (let row = 0; row < 2; row += 1) for (let column = 0; column < 2; column += 1) {
      diagram.fixture(`array-${row}-${column}`, `R${row} C${column}`, row === 0 && column === 0 ? String(model.stored) : String((row + column) % 2), 1005 + column * 150, 230 + row * 220, row === 0 && column === 0 ? 'enlarged at left' : 'unselected', 105)
    }
    diagram.region('periphery', 'Peripheral circuits / outside the 6T cell', 'observer', 30, 670, 1220, 170)
      .fixture('sense', 'Differential sense amplifier', model.sensed === null ? 'not sampled' : String(model.sensed), 400, 745, undefined, 230)
      .fixture('driver', 'Write driver', model.operation.startsWith('write') ? 'drive complementary BLs' : 'idle', 900, 745, undefined, 270)
      .connect('sense-bl', 'bl', 'sense', 'read differential', model.operation === 'sense', 80)
      .connect('sense-bl-bar', 'bl-bar', 'sense', 'read differential', model.operation === 'sense', -80)
      .connect('write-drive', 'driver', 'bl-bar', 'write drive', model.operation.startsWith('write'), 85)
      .connect('write-drive-left', 'driver', 'bl', 'complementary write drive', model.operation.startsWith('write'), -95)
    return new CpuModel([], 'Powered 6T feedback holds the bit without periodic refresh. Reads sense a small bit-line differential; writes overpower the feedback through access transistors. Dual-port cells can use other transistor counts. No analog stability or transistor timing is simulated.', 'q', 0, diagram)
  }
}
