import { EthernetFrame } from '../EthernetFrame.ts'

export class ServerToNetworkModel {
  public readonly serverMemory = EthernetFrame.body()
  public txBuffer: Uint8Array | null = null
  public frame: Uint8Array | null = null
  public network: Uint8Array | null = null
  public completed = false

  public stage(): void { this.txBuffer = this.serverMemory.slice() }
  public frameAtMac(): void {
    if (!this.txBuffer) throw new Error('DMA must fill the TX buffer before MAC transmission')
    this.frame = EthernetFrame.encode(this.txBuffer)
  }
  public emit(): void {
    if (!this.frame) throw new Error('The MAC must form a frame before transmission')
    this.network = this.frame.slice()
  }
  public complete(): void {
    if (!this.network) throw new Error('Finish the modeled transmit before completion')
    this.completed = true
  }
}
