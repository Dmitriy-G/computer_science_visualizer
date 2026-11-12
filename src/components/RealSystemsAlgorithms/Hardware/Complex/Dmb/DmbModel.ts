import { PublicationModel } from '../PublicationModel.ts'
import { HardwareModel } from '../HardwareModel.ts'

export class DmbModel extends PublicationModel {
  public readonly barrier: boolean

  constructor(barrier: boolean) {
    super()
    this.barrier = barrier
  }
  public publish(): boolean { return this.publishFlag(this.barrier) }
  public consume(): void {
    this.readFlag(false)
    if (this.barrier && this.observedFlag !== 1) throw new Error('Wait for the flag')
    this.readData()
  }
  public view() {
    const state = this.snapshot(this.barrier ? 'dmb' : 'plain')
    return new HardwareModel([...state.banks, { name: 'Scope', cells: [
      { id: 'producer-scope', label: 'producer', value: 'inside ISH' },
      { id: 'consumer-scope', label: 'consumer', value: 'inside ISH' },
      { id: 'outside-scope', label: 'other observer', value: 'outside ISH', status: 'scope marker only' },
    ] }], null, 0, state.diagram)
  }
}
