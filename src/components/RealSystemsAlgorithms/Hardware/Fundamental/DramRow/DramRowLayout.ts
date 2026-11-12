import { HardwareDiagram } from '../../../../../visualization/HardwareDiagram.ts'
import { CpuModel } from '../CpuModel.ts'
import type { DramRowModel } from './DramRowModel.ts'

export class DramRowLayout {
  public static create(model: DramRowModel): CpuModel {
    const diagram = new HardwareDiagram(1130, 1000)
    diagram.region('dram', 'DRAM bank / symbolic command intervals', 'memory', 30, 30, 1070, 940)
      .fixture('command', 'Bank command / state', model.stage, 260, 125, undefined, 300)
      .fixture('word-line', 'Selected word line', model.activeRow === null ? 'all low' : `row ${model.activeRow} high`, 810, 125, undefined, 250)
    for (let row = 0; row < 2; row += 1) {
      for (let column = 0; column < 3; column += 1) {
        const id = `cell-${row}-${column}`
        const status = model.activeRow === row ? model.restored ? 'charge restored' : 'charge shared' : 'isolated / charged'
        diagram.fixture(id, `R${row} C${column} / capacitor + 1T`, String(model.rows[row][column]), 220 + column * 340, 285 + row * 170, status, 240)
      }
    }
    for (let column = 0; column < 3; column += 1) {
      const bitLine = model.stage === 'precharged' ? 'VDD/2' : model.stage === 'charge sharing' ? model.rows[model.activeRow!][column] ? 'VDD/2 + small delta' : 'VDD/2 - small delta' : String(model.buffer?.[column] ?? '?')
      diagram.fixture(`bl-${column}`, `Bit line ${column}`, bitLine, 220 + column * 340, 625, undefined, 240)
        .fixture(`sense-${column}`, `Sense amp / row-buffer C${column}`, model.buffer ? String(model.buffer[column]) : 'equalized', 220 + column * 340, 790, undefined, 240)
      if (model.activeRow !== null) {
        const cell = `cell-${model.activeRow}-${column}`
        diagram.connect(`charge-${column}`, cell, `bl-${column}`, 'share charge', model.stage === 'charge sharing')
          .connect(`sense-flow-${column}`, `bl-${column}`, `sense-${column}`, 'sense', model.stage === 'sensed')
          .connect(`restore-${column}`, `sense-${column}`, cell, 'restore / write', model.stage === 'restored' || model.stage === 'write recovery' && model.selectedColumn === column, 55)
      }
    }
    diagram.fixture('io', 'Selected-column data I/O', model.output === null ? 'no read yet' : String(model.output), 560, 920, undefined, 270)
    if (model.selectedColumn !== null) diagram.connect('column-io', `sense-${model.selectedColumn}`, 'io', 'column READ', model.stage === 'read')
    if (model.selectedColumn !== null) diagram.connect('column-write', 'io', `sense-${model.selectedColumn}`, 'column WRITE', model.stage === 'write recovery', 55)
    return new CpuModel([], 'command', 0, diagram)
  }
}
