import { EthernetFrame } from '../../NetworkAdapter/EthernetFrame.ts'

export class NetworkByteToSsdModel {
  public readonly network: Uint8Array
  public readonly originalBlock = new Uint8Array(512).fill(0x2e)
  public received: Uint8Array | null = null
  public ramReceive: Uint8Array | null = null
  public cpuMessage: Uint8Array | null = null
  public ramBlock: Uint8Array | null = null
  public ssdBuffer: Uint8Array | null = null
  public storedBlock: Uint8Array
  public rxComplete = false
  public commandFetched = false
  public durable = false
  public completion = false
  public acknowledged = false

  constructor(frame?: Uint8Array) {
    const body = EthernetFrame.body()
    body.set([0x01, 0x07, 0x41], 14)
    this.network = frame?.slice() ?? EthernetFrame.encode(body)
    this.storedBlock = this.originalBlock.slice()
  }

  public receive(): void { this.received = EthernetFrame.decode(this.network) }

  public dmaReceive(): void {
    if (!this.received) throw new Error('Validate the frame before receive DMA')
    this.ramReceive = this.received.slice()
  }

  public completeReceive(): void {
    if (!this.ramReceive) throw new Error('Deliver receive data before completion')
    this.rxComplete = true
  }

  public readMessage(): void {
    if (!this.rxComplete || !this.ramReceive) throw new Error('Wait for receive completion before CPU access')
    this.cpuMessage = this.ramReceive.slice(14, 17)
  }

  public prepareWrite(): void {
    if (!this.cpuMessage || this.cpuMessage[0] !== 0x01) throw new Error('Decode a SAVE command before preparing storage')
    // The existing 512-byte logical block was loaded before the lesson begins.
    this.ramBlock = this.originalBlock.slice()
    this.ramBlock[this.cpuMessage[1]] = this.cpuMessage[2]
  }

  public fetchCommand(): void {
    if (!this.ramBlock) throw new Error('Publish the write buffer and command before SSD fetch')
    this.commandFetched = true
  }

  public dmaReadBlock(): void {
    if (!this.commandFetched || !this.ramBlock) throw new Error('Fetch the SSD command before its data')
    this.ssdBuffer = this.ramBlock.slice()
  }

  public commitFua(): void {
    if (!this.ssdBuffer) throw new Error('Deliver the whole logical block before persisting')
    this.storedBlock = this.ssdBuffer.slice()
    this.durable = true
  }

  public completeWrite(): void {
    if (!this.durable) throw new Error('FUA completion must follow nonvolatile commitment')
    this.completion = true
  }

  public acknowledge(): void {
    if (!this.completion) throw new Error('CPU must observe SSD completion before reporting success')
    this.acknowledged = true
  }
}
