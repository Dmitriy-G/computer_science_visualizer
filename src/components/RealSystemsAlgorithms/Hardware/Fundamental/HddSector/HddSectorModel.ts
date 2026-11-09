import type { Bit } from '../Latch/LatchModel.ts'
import { HddSectorLayout } from './HddSectorLayout.ts'

export class HddSectorModel {
  public readonly targetTrack = 1
  public readonly targetSector = 3
  public track = 0
  public rotation = 0
  public settled = false
  public operation = 'idle'
  public readonly data: Bit[] = [1, 0, 1, 1]
  public readonly magneticRegions: number[] = []
  public readonly readSignal: number[] = []
  public decoded: Bit[] = []
  public checked = false

  public seek(): void { this.track = this.targetTrack; this.operation = 'seek' }
  public settle(): void { this.settled = true; this.operation = 'settled' }
  public rotate(): void { this.rotation = (this.rotation + 1) % 8; this.operation = 'rotation' }

  public aligned(): boolean { return this.settled && this.track === this.targetTrack && this.rotation === this.targetSector }

  public write(): void {
    if (!this.aligned()) throw new Error('Position and settle the head before writing')
    this.magneticRegions.length = 0
    let parity = 0
    for (const bit of this.data) parity ^= bit
    for (const bit of [...this.data, parity]) this.magneticRegions.push(bit ? -1 : 1, bit ? 1 : -1)
    this.operation = 'write'
  }

  public sense(): void {
    if (!this.aligned() || !this.magneticRegions.length) throw new Error('Read a recorded sector under the head')
    this.readSignal.length = 0
    let previous = 0
    for (const region of this.magneticRegions) {
      this.readSignal.push(region - previous)
      previous = region
    }
    this.operation = 'sense'
  }

  public decode(): void {
    if (!this.readSignal.length) throw new Error('Sense the read signal first')
    const bits: Bit[] = []
    for (let index = 1; index < this.readSignal.length; index += 2) bits.push(this.readSignal[index] > 0 ? 1 : 0)
    let parity = 0
    for (const bit of bits) parity ^= bit
    this.checked = parity === 0
    this.decoded = bits.slice(0, -1)
    this.operation = 'decode'
  }

  public snapshot() { return HddSectorLayout.create(this) }
}
