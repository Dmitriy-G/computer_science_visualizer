import type { Bit } from '../Latch/LatchModel.ts'
import { SramCellLayout } from './SramCellLayout.ts'

export class SramCellModel {
  public stored: Bit = 1
  public wordLine = false
  public bitLine = 'isolated'
  public inverseBitLine = 'isolated'
  public sensed: Bit | null = null
  public operation = 'hold'

  public precharge(): void {
    this.wordLine = false
    this.bitLine = 'high'
    this.inverseBitLine = 'high'
    this.operation = 'precharge'
  }

  public selectRead(): void {
    if (this.operation !== 'precharge') throw new Error('Prepare the bit lines before read access')
    this.wordLine = true
    this.bitLine = this.stored ? 'high' : 'slightly lower'
    this.inverseBitLine = this.stored ? 'slightly lower' : 'high'
    this.operation = 'read access'
  }

  public sense(): void {
    if (!this.wordLine || this.operation !== 'read access') throw new Error('Select a prepared read first')
    this.sensed = this.stored
    this.operation = 'sense'
  }

  public driveWrite(value: Bit): void {
    this.wordLine = false
    this.bitLine = String(value)
    this.inverseBitLine = String(1 - value)
    this.operation = 'write drive'
  }

  public write(): void {
    if (this.operation !== 'write drive') throw new Error('Drive complementary bit lines before writing')
    this.wordLine = true
    this.stored = this.bitLine === '1' ? 1 : 0
    this.operation = 'write'
  }

  public isolate(): void {
    this.wordLine = false
    this.operation = 'hold'
  }

  public snapshot() { return SramCellLayout.create(this) }
}
