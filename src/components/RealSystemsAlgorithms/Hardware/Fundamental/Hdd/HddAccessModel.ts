import type { Bit } from '../Latch/LatchModel.ts'
import { HddEcc } from '../HddSector/HddEcc.ts'
import { HddRecordingCode } from '../HddSector/HddRecordingCode.ts'
import type { HddPhysicalLocation } from '../HddSector/HddSectorModel.ts'
import { HddMediaExample } from './HddMediaExample.ts'

export type HddAccessOperation = 'write' | 'read'
export type HddAccessPhase = 'idle' | 'buffered' | 'encoded' | 'ready' | 'written' | 'sensed' | 'detected' | 'recording-decoded' | 'checked' | 'uncorrectable' | 'read-buffered' | 'delivered'

export class HddAccessModel {
  public static readonly sectorBytes = HddMediaExample.dataBytesPerSector
  public readonly kind: HddAccessOperation
  public readonly logicalAddress = 7
  public track = 0
  public rotation = 0
  public settled = false
  public spinning = false
  public operation = 'idle'
  private readonly mapping = new Map<number, HddPhysicalLocation>([[7, { head: 0, track: 1, sector: 3 }]])
  private readonly location = this.translate(this.logicalAddress)
  private readonly neighbor = new Uint8Array(HddAccessModel.sectorBytes).fill(60)
  private media: Uint8Array
  private cache: Uint8Array | null = null
  private output: Uint8Array | null = null
  private code: Bit[] = []
  private symbols: Bit[] = []
  private pendingMagnetization: number[] = []
  private writtenPreview = 0
  private magnetization: number[]
  private signal: number[] = []
  private detected: Bit[] = []
  private received: Bit[] = []
  private checked: Uint8Array | null = null
  private currentPhase: HddAccessPhase = 'idle'

  constructor(kind: HddAccessOperation) {
    this.kind = kind
    this.media = kind === 'read' ? HddAccessModel.payload() : new Uint8Array(HddAccessModel.sectorBytes).fill(17)
    this.magnetization = HddRecordingCode.magnetize(HddRecordingCode.encode(HddAccessModel.encode(this.media)))
  }

  public static payload(): Uint8Array {
    const bytes = new Uint8Array(this.sectorBytes)
    for (let index = 0; index < bytes.length; index += 1) bytes[index] = (165 + 13 * index) & 255
    return bytes
  }

  public static summary(bytes: Uint8Array | null): string {
    if (!bytes) return 'empty'
    return `${bytes.length} B / ${bytes[0].toString(16).padStart(2, '0').toUpperCase()} ${bytes[1].toString(16).padStart(2, '0').toUpperCase()} ...`
  }

  public get targetTrack(): number { return this.location.track }
  public get targetSector(): number { return this.location.sector }
  public get phase(): HddAccessPhase { return this.currentPhase }
  public storedData(): Uint8Array { return this.media.slice() }
  public recordedPolarity(): number { return this.magnetization[HddMediaExample.illustratedInterval] }
  public recordedPattern(): number[] { return this.magnetization.slice(0, HddMediaExample.previewIntervals) }
  public pendingPattern(): number[] { return this.pendingMagnetization.slice(0, HddMediaExample.previewIntervals) }
  public get writtenPreviewIntervals(): number { return this.writtenPreview }
  public neighborData(): Uint8Array { return this.neighbor.slice() }
  public cacheData(): Uint8Array | null { return this.cache?.slice() ?? null }
  public returnedData(): Uint8Array | null { return this.output?.slice() ?? null }

  public translate(lba: number): HddPhysicalLocation {
    const location = this.mapping.get(lba)
    if (!location) throw new RangeError('Unknown LBA in the HDD example')
    return { ...location }
  }

  public startSpindle(): void { this.spinning = true }
  public seek(): void {
    if (!this.spinning) throw new Error('Start platter rotation before seeking')
    this.track = this.targetTrack
    this.settled = false
    this.rotation = (this.rotation + 1) % 8
    this.operation = 'seek'
  }
  public settle(): void {
    if (!this.spinning || this.track !== this.targetTrack) throw new Error('Seek before settling')
    this.settled = true
    this.rotation = (this.rotation + 1) % 8
    this.operation = 'settled'
  }
  public rotate(): void {
    if (!this.spinning) throw new Error('Spindle is stopped')
    this.rotation = (this.rotation + 1) % 8
    this.operation = 'rotation'
  }
  public aligned(): boolean { return this.spinning && this.settled && this.track === this.targetTrack && this.rotation === this.targetSector }

  public receive(bytes: Uint8Array): void {
    this.require('idle')
    if (this.kind !== 'write' || bytes.length !== HddAccessModel.sectorBytes) throw new RangeError('Write exactly one 512-byte logical sector')
    this.cache = bytes.slice()
    this.currentPhase = 'buffered'
  }
  public encodeEcc(): void {
    this.require('buffered')
    this.code = HddAccessModel.encode(this.cache!)
    this.currentPhase = 'encoded'
  }
  public encodeRecording(): void {
    this.require('encoded')
    this.symbols = HddRecordingCode.encode(this.code)
    this.pendingMagnetization = HddRecordingCode.magnetize(this.symbols)
    this.currentPhase = 'ready'
  }
  public writeNextInterval(): void {
    this.require('ready')
    if (!this.aligned()) throw new Error('Seek, settle, and wait for sector alignment before writing')
    if (this.writtenPreview >= HddMediaExample.previewIntervals) throw new Error('All preview intervals are recorded')
    this.magnetization[this.writtenPreview] = this.pendingMagnetization[this.writtenPreview]
    this.writtenPreview += 1
    this.operation = 'write'
  }
  public write(): void {
    this.require('ready')
    if (!this.aligned()) throw new Error('Seek, settle, and wait for sector alignment before writing')
    this.magnetization = this.pendingMagnetization.slice()
    this.media = this.cache!.slice()
    this.operation = 'write'
    this.currentPhase = 'written'
  }
  public sense(): void {
    this.require('idle')
    if (this.kind !== 'read' || !this.aligned()) throw new Error('Seek, settle, and wait for sector alignment before reading')
    this.signal = HddRecordingCode.sense(this.magnetization)
    this.operation = 'sense'
    this.currentPhase = 'sensed'
  }
  public detect(): void {
    this.require('sensed')
    this.detected = HddRecordingCode.detect(this.signal)
    this.currentPhase = 'detected'
  }
  public decodeRecording(): void {
    this.require('detected')
    this.received = HddRecordingCode.decode(this.detected)
    this.currentPhase = 'recording-decoded'
  }
  public injectError(index: number): void {
    this.require('recording-decoded')
    if (!Number.isInteger(index) || index < 0 || index >= this.received.length) throw new RangeError('Invalid codeword-bit index')
    this.received[index] = (this.received[index] ^ 1) as Bit
  }
  public correct(): boolean {
    this.require('recording-decoded')
    const nibbles: number[] = []
    for (let index = 0; index < this.received.length; index += 8) {
      const result = HddEcc.decode(this.received.slice(index, index + 8))
      if (result.status === 'uncorrectable') {
        this.currentPhase = 'uncorrectable'
        return false
      }
      let nibble = 0
      for (const bit of result.data) nibble = nibble * 2 + bit
      nibbles.push(nibble)
    }
    this.checked = new Uint8Array(HddAccessModel.sectorBytes)
    for (let index = 0; index < this.checked.length; index += 1) this.checked[index] = nibbles[index * 2] * 16 + nibbles[index * 2 + 1]
    this.currentPhase = 'checked'
    return true
  }
  public bufferRead(): void {
    this.require('checked')
    this.cache = this.checked!.slice()
    this.currentPhase = 'read-buffered'
  }
  public deliver(): void {
    this.require('read-buffered')
    this.output = this.cache!.slice()
    this.currentPhase = 'delivered'
  }

  private require(phase: HddAccessPhase): void {
    if (this.currentPhase !== phase) throw new Error(`Invalid HDD access stage: ${this.currentPhase}`)
  }
  private static encode(bytes: Uint8Array): Bit[] {
    const code: Bit[] = []
    for (const byte of bytes) {
      for (const shift of [4, 0]) {
        const nibble = byte >> shift & 15
        code.push(...HddEcc.encode([nibble >> 3 & 1, nibble >> 2 & 1, nibble >> 1 & 1, nibble & 1] as Bit[]))
      }
    }
    return code
  }
}
