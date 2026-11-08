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
    // Reader DMB ISHLD places the data load after the flag load.
    if (this.barrier && this.observedFlag !== 1) throw new Error('Wait for the flag')
    this.readData()
  }
  public view() {
    const state = this.snapshot('Armv8-A AArch64: aligned shared Normal cacheable memory. Producer and consumer are in one Inner Shareable domain. Writer DMB ISHST orders stores; reader DMB ISHLD orders its flag load before the data load. An observer outside this domain is outside the selected guarantee. DMB orders accesses, not general completion or persistence.', this.barrier ? 'dmb' : 'plain')
    return new HardwareModel([...state.banks, { name: 'Scope', cells: [
      { id: 'producer-scope', label: 'producer', value: 'inside ISH' },
      { id: 'consumer-scope', label: 'consumer', value: 'inside ISH' },
      { id: 'outside-scope', label: 'other observer', value: 'outside ISH', status: 'scope marker only' },
    ] }], state.detail, null, 0, state.diagram)
  }
}
