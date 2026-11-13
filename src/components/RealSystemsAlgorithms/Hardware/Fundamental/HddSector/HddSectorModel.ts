import type { Bit } from '../Latch/LatchModel.ts'
import { HddSectorLayout } from './HddSectorLayout.ts'
import { HddEcc } from './HddEcc.ts'
import { HddRecordingCode } from './HddRecordingCode.ts'
import type { HddEccResult } from './HddEcc.ts'

export interface HddPhysicalLocation {
  readonly head: number
  readonly track: number
  readonly sector: number
}

export class HddSectorModel {
  public readonly logicalAddress = 7
  private readonly firmwareMap = new Map<number, HddPhysicalLocation>([[7, { head: 0, track: 1, sector: 3 }]])
  public readonly location: HddPhysicalLocation
  public readonly data: readonly Bit[]
  public buffer: Bit[]
  public track = 0
  public rotation = 0
  public settled = false
  public operation = 'idle'
  public eccCodeword: Bit[] = []
  public recordingBits: Bit[] = []
  public magneticRegions: number[] = []
  public readSignal: number[] = []
  public detectedBits: Bit[] = []
  public receivedCodeword: Bit[] = []
  public correctedCodeword: Bit[] = []
  public decoded: Bit[] = []
  public transferred: Bit[] = []
  public checked = false
  public syndrome: number | null = null
  public overallParity: Bit | null = null
  public correctedBit: number | null = null
  public eccStatus: HddEccResult['status'] | 'pending' = 'pending'

  constructor(data: readonly Bit[] = [1, 0, 1, 1]) {
    if (data.length !== 4) throw new RangeError('The HDD teaching sector contains four data bits')
    for (const bit of data) if (bit !== 0 && bit !== 1) throw new RangeError('Expected binary bits')
    this.data = [...data]
    this.buffer = [...data]
    this.location = this.translate(this.logicalAddress)
  }

  public get targetTrack(): number { return this.location.track }
  public get targetSector(): number { return this.location.sector }

  public translate(lba: number): HddPhysicalLocation {
    const location = this.firmwareMap.get(lba)
    if (!location) throw new RangeError('LBA has no mapping in this bounded example')
    return { ...location }
  }

  private advanceRotation(): void { this.rotation = (this.rotation + 1) % 8 }

  public seek(): void {
    this.track = this.targetTrack
    this.settled = false
    this.advanceRotation()
    this.operation = 'seek'
  }

  public settle(): void {
    if (this.track !== this.targetTrack) throw new Error('Seek to the requested track before settling')
    this.settled = true
    this.advanceRotation()
    this.operation = 'settled'
  }

  public rotate(): void {
    this.advanceRotation()
    this.operation = 'rotation'
  }

  public aligned(): boolean { return this.settled && this.track === this.targetTrack && this.rotation === this.targetSector }

  private resetReadback(): void {
    this.readSignal = []
    this.detectedBits = []
    this.receivedCodeword = []
    this.correctedCodeword = []
    this.decoded = []
    this.transferred = []
    this.checked = false
    this.syndrome = null
    this.overallParity = null
    this.correctedBit = null
    this.eccStatus = 'pending'
  }

  public encodeEcc(): void {
    this.eccCodeword = HddEcc.encode(this.buffer)
    this.recordingBits = []
    this.magneticRegions = []
    this.resetReadback()
    this.operation = 'ecc-encode'
  }

  public encodeRecording(): void {
    if (this.eccCodeword.length !== 8) throw new Error('Generate the ECC codeword before recording encoding')
    this.recordingBits = HddRecordingCode.encode(this.eccCodeword)
    this.operation = 'recording-encode'
  }

  public write(): void {
    if (!this.aligned()) throw new Error('Position and settle the head before writing')
    if (this.recordingBits.length !== 16) throw new Error('Encode ECC and recording symbols before writing')
    this.magneticRegions = HddRecordingCode.magnetize(this.recordingBits)
    this.resetReadback()
    this.operation = 'write'
  }

  public sense(): void {
    if (!this.aligned() || this.magneticRegions.length !== 16) throw new Error('Read a recorded sector under the head')
    this.resetReadback()
    this.readSignal = HddRecordingCode.sense(this.magneticRegions)
    this.operation = 'sense'
  }

  public detect(): void {
    if (this.readSignal.length !== 16) throw new Error('Sense the read signal before detection')
    this.detectedBits = HddRecordingCode.detect(this.readSignal)
    this.operation = 'detect'
  }

  public decodeRecording(): void {
    if (this.detectedBits.length !== 16) throw new Error('Detect channel symbols before recording decoding')
    this.receivedCodeword = HddRecordingCode.decode(this.detectedBits)
    this.correctedCodeword = []
    this.decoded = []
    this.checked = false
    this.eccStatus = 'pending'
    this.operation = 'recording-decode'
    this.syndrome = null
    this.overallParity = null
    this.correctedBit = null
  }

  public injectReadError(index: number): void {
    if (this.receivedCodeword.length !== 8 || this.eccStatus !== 'pending') throw new Error('Decode recording symbols before injecting a read error')
    if (!Number.isInteger(index) || index < 0 || index >= 8) throw new RangeError('Read-error bit index must be 0 through 7')
    this.receivedCodeword[index] = (this.receivedCodeword[index] ^ 1) as Bit
    this.operation = 'read-error'
  }

  public decode(): boolean {
    if (this.receivedCodeword.length !== 8) throw new Error('Recover the ECC codeword before error correction')
    const result = HddEcc.decode(this.receivedCodeword)
    this.correctedCodeword = [...result.codeword]
    this.decoded = [...result.data]
    this.syndrome = result.syndrome
    this.overallParity = result.overallParity
    this.correctedBit = result.correctedBit
    this.eccStatus = result.status
    this.checked = result.status !== 'uncorrectable'
    this.operation = 'ecc-decode'
    return this.checked
  }

  public bufferRead(): void {
    if (!this.checked || this.decoded.length !== 4) throw new Error('ECC must validate the data before buffering it')
    this.buffer = [...this.decoded]
    this.operation = 'buffer-read'
  }

  public transfer(): void {
    if (!this.checked || this.operation !== 'buffer-read') throw new Error('Buffer validated read data before returning it')
    this.transferred = [...this.buffer]
    this.operation = 'transfer'
  }

  public snapshot() { return HddSectorLayout.create(this) }
}
