import type { Bit } from '../Latch/LatchModel.ts'
import { DramRowLayout } from './DramRowLayout.ts'

export class DramRowModel {
  public readonly rows: Bit[][] = [[1, 0, 1], [0, 1, 0]]
  public activeRow: number | null = null
  public buffer: Bit[] | null = null
  public stage = 'precharged'
  public selectedColumn: number | null = null
  public output: Bit | null = null
  public restored = false
  public recoveryComplete = true

  public activate(row: number): void {
    if (this.stage !== 'precharged' || !this.rows[row]) throw new Error('Precharge before selecting a valid row')
    this.activeRow = row
    this.restored = false
    this.buffer = null
    this.selectedColumn = null
    this.stage = 'charge sharing'
  }

  public sense(): void {
    if (this.activeRow === null || this.stage !== 'charge sharing') throw new Error('Activate before sensing')
    this.buffer = [...this.rows[this.activeRow]]
    this.stage = 'sensed'
  }

  public restore(): void {
    if (this.activeRow === null || !this.buffer) throw new Error('Sense before restoring')
    this.rows[this.activeRow] = [...this.buffer]
    this.restored = true
    this.stage = 'restored'
  }

  public read(column: number): Bit {
    if (!this.buffer || this.buffer[column] === undefined) throw new Error('Read a column from an active sensed row')
    this.selectedColumn = column
    this.output = this.buffer[column]
    this.stage = 'read'
    return this.output
  }

  public write(column: number, value: Bit): void {
    if (!this.buffer || this.activeRow === null || this.buffer[column] === undefined) throw new Error('Write a column in an active sensed row')
    this.buffer[column] = value
    this.rows[this.activeRow][column] = value
    this.selectedColumn = column
    this.recoveryComplete = false
    this.stage = 'write recovery'
  }

  public recover(): void {
    this.recoveryComplete = true
    this.stage = 'ready to close'
  }

  public precharge(): void {
    if (!this.restored || !this.recoveryComplete) throw new Error('Finish restoration and write recovery before precharge')
    this.activeRow = null
    this.buffer = null
    this.selectedColumn = null
    this.stage = 'precharged'
  }

  public snapshot() { return DramRowLayout.create(this) }
}
