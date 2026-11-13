import { DramRowModel } from '../DramRow/DramRowModel.ts'
import type { Bit } from '../Latch/LatchModel.ts'

export type RamBitOperation = 'read' | 'write'
export type RamBitCommand = 'ACTIVATE' | 'READ' | 'WRITE' | 'PRECHARGE'
type RamBitStage = 'precharged' | 'sharing' | 'sensed' | 'active' | 'write-buffer' | 'write-recovery' | 'disconnected'

export class RamBitModel {
  public readonly row = 0
  public readonly column = 1
  public readonly operation: RamBitOperation
  public readonly bit: Bit
  public stage: RamBitStage = 'precharged'
  public wordline = false
  public socketCommand: RamBitCommand | null = null
  public controlCommand: RamBitCommand | null = null
  public socketData: Bit | null = null
  public ioData: Bit | null = null
  public columnData: Bit | null = null
  public controllerData: Bit | null
  public columnSelected = false

  private readonly bank = new DramRowModel()
  private charge: number
  private bitline = 0.5

  constructor(operation: RamBitOperation, bit: Bit = 1) {
    if (operation !== 'read' && operation !== 'write') throw new TypeError('Expected read or write')
    if (bit !== 0 && bit !== 1) throw new RangeError('A bit must be zero or one')
    this.operation = operation
    this.bit = bit
    this.bank.rows[0] = operation === 'read' ? [0, bit, 0] : [1, bit === 1 ? 0 : 1, 1]
    this.controllerData = operation === 'write' ? bit : null
    this.charge = this.cell
  }

  public get rows(): readonly (readonly Bit[])[] { return this.bank.rows }
  public get buffer(): readonly Bit[] | null { return this.bank.buffer }
  public get cell(): Bit { return this.bank.rows[this.row][this.column] }
  public get capacitorCharge(): number { return this.charge }
  public get bitlineLevel(): number { return this.bitline }
  public get activeRow(): number | null { return this.bank.activeRow }
  public get restored(): boolean { return this.bank.restored }
  public get recoveryComplete(): boolean { return this.bank.recoveryComplete }

  public activate(): void {
    this.requireStage('precharged')
    this.bank.activate(this.row)
    this.wordline = true
    this.charge = 0.5 + (this.cell === 1 ? 0.02 : -0.02)
    this.bitline = this.charge
    this.stage = 'sharing'
  }

  public sense(): void {
    this.requireStage('sharing')
    this.bank.sense()
    this.bitline = this.bank.buffer![this.column]
    this.stage = 'sensed'
  }

  public restore(): void {
    this.requireStage('sensed')
    this.bank.restore()
    this.charge = this.cell
    this.stage = 'active'
  }

  public selectColumn(): void {
    this.requireStage('active')
    this.columnSelected = true
  }

  public readColumn(): Bit {
    this.requireStage('active')
    if (this.operation !== 'read' || !this.columnSelected) throw new Error('Select a read column first')
    this.columnData = this.bank.read(this.column)
    return this.columnData
  }

  public driveWriteBuffer(): void {
    this.requireStage('active')
    if (this.operation !== 'write' || !this.columnSelected || this.columnData !== this.bit) throw new Error('Deliver the write data to the selected column first')
    this.bank.buffer![this.column] = this.bit
    this.stage = 'write-buffer'
  }

  public driveBitline(): void {
    if (this.stage !== 'sensed' && this.stage !== 'write-buffer') throw new Error('Sense or drive the row buffer first')
    this.bitline = this.bank.buffer![this.column]
  }

  public storeWrite(): void {
    this.requireStage('write-buffer')
    if (this.bitline !== this.bit) throw new Error('Drive the bitline before charging the capacitor')
    this.bank.write(this.column, this.bit)
    this.charge = this.bit
    this.stage = 'write-recovery'
  }

  public recoverWrite(): void {
    this.requireStage('write-recovery')
    this.bank.recover()
    this.stage = 'active'
  }

  public receiveRead(): void {
    this.requireStage('active')
    if (this.operation !== 'read' || this.socketData === null || this.socketData !== this.bank.output) throw new Error('Deliver read data through the socket first')
    this.controllerData = this.socketData
  }

  public disconnect(): void {
    this.requireStage('active')
    if (!this.bank.restored || !this.bank.recoveryComplete) throw new Error('Complete restoration and write recovery before closing')
    if (this.operation === 'read' && this.controllerData === null) throw new Error('Complete the read before closing this lesson')
    if (this.operation === 'write' && this.cell !== this.bit) throw new Error('Store the write before closing this lesson')
    this.wordline = false
    this.stage = 'disconnected'
  }

  public precharge(): void {
    this.requireStage('disconnected')
    this.bank.precharge()
    this.bitline = 0.5
    this.columnSelected = false
    this.stage = 'precharged'
  }

  private requireStage(stage: RamBitStage): void {
    if (this.stage !== stage) throw new Error(`Expected ${stage}, received ${this.stage}`)
  }
}
