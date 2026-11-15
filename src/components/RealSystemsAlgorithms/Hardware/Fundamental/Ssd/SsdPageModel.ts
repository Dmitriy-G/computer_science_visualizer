import { SsdNandExample } from './SsdNandExample.ts'

export type SsdPageOperation = 'write' | 'read'
export type SsdPagePhase = 'idle' | 'buffered' | 'encoded' | 'latched' | 'programmed' | 'verified' | 'committed' | 'sensed' | 'decoded' | 'delivered'

export class SsdPageModel {
  public readonly operation: SsdPageOperation
  private readonly pages: Uint8Array[]
  private buffer: Uint8Array | null = null
  private latch: Uint8Array | null = null
  private decoded: Uint8Array | null = null
  private output: Uint8Array | null = null
  private currentPhase: SsdPagePhase = 'idle'
  private mapped: boolean

  constructor(operation: SsdPageOperation) {
    this.operation = operation
    this.pages = [new Uint8Array(SsdNandExample.dataBytesPerPage).fill(255), new Uint8Array(SsdNandExample.dataBytesPerPage).fill(60)]
    this.mapped = operation === 'read'
    if (operation === 'read') this.pages[0] = SsdPageModel.payload()
  }

  public static payload(): Uint8Array {
    const bytes = new Uint8Array(SsdNandExample.dataBytesPerPage)
    for (let index = 0; index < bytes.length; index += 1) bytes[index] = (164 + index * 17) & 255
    return bytes
  }

  public get phase(): SsdPagePhase { return this.currentPhase }
  public get mappingPublished(): boolean { return this.mapped }
  public get storedBit(): number { return this.pages[0][0] & 1 }
  public page(index: number): Uint8Array {
    if (!this.pages[index]) throw new RangeError('Unknown NAND page')
    return this.pages[index].slice()
  }
  public returnedData(): Uint8Array | null { return this.output?.slice() ?? null }

  public receive(bytes: Uint8Array): void {
    this.require('write', 'idle')
    if (bytes.length !== SsdNandExample.dataBytesPerPage) throw new RangeError('Provide exactly one complete NAND data page')
    this.buffer = bytes.slice()
    this.currentPhase = 'buffered'
  }

  public encode(): void {
    this.require('write', 'buffered')
    // ECC is a separate conceptual controller stage; redundancy is not computed.
    this.currentPhase = 'encoded'
  }

  public latchProgramData(): void {
    this.require('write', 'encoded')
    this.latch = this.buffer!.slice()
    this.currentPhase = 'latched'
  }

  public program(): void {
    this.require('write', 'latched')
    for (const byte of this.pages[0]) if (byte !== 255) throw new Error('Programming requires an erased destination page')
    this.pages[0] = this.latch!.slice()
    this.currentPhase = 'programmed'
  }

  public verify(): void {
    this.require('write', 'programmed')
    for (let index = 0; index < this.pages[0].length; index += 1) {
      if (this.pages[0][index] !== this.buffer![index]) throw new Error('NAND program verification failed')
    }
    this.currentPhase = 'verified'
  }

  public publishMapping(): void {
    this.require('write', 'verified')
    this.mapped = true
    this.currentPhase = 'committed'
  }

  public sense(): void {
    this.require('read', 'idle')
    if (!this.mapped) throw new Error('The logical page is unmapped')
    this.latch = this.pages[0].slice()
    this.currentPhase = 'sensed'
  }

  public decode(): void {
    this.require('read', 'sensed')
    // The example has no injected errors; the ECC stage preserves every byte.
    this.decoded = this.latch!.slice()
    this.currentPhase = 'decoded'
  }

  public deliver(): void {
    this.require('read', 'decoded')
    this.output = this.decoded!.slice()
    this.currentPhase = 'delivered'
  }

  private require(operation: SsdPageOperation, phase: SsdPagePhase): void {
    if (this.operation !== operation || this.currentPhase !== phase) throw new Error(`Invalid NAND ${operation} stage: ${this.currentPhase}`)
  }
}
