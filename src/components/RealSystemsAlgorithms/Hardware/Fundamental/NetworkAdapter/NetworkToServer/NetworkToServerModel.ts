import { EthernetFrame } from '../EthernetFrame.ts'

export class NetworkToServerModel {
  public readonly network: Uint8Array
  public accepted: Uint8Array | null = null
  public rxBuffer: Uint8Array | null = null
  public serverMemory: Uint8Array | null = null
  public completed = false

  constructor(frame: Uint8Array = EthernetFrame.encode(EthernetFrame.body())) { this.network = frame.slice() }
  public validate(): void {
    const body = EthernetFrame.decode(this.network)
    const configured = EthernetFrame.body()
    for (let index = 0; index < 6; index += 1) if (body[index] !== configured[index]) throw new Error('Destination MAC is not accepted')
    this.accepted = body
  }
  public buffer(): void {
    if (!this.accepted) throw new Error('Accept and check the frame before buffering')
    this.rxBuffer = this.accepted.slice()
  }
  public writeHost(): void {
    if (!this.rxBuffer) throw new Error('Buffer the frame before receive DMA')
    this.serverMemory = this.rxBuffer.slice()
  }
  public complete(): void {
    if (!this.serverMemory) throw new Error('Finish DMA writes before receive completion')
    this.completed = true
  }
}
