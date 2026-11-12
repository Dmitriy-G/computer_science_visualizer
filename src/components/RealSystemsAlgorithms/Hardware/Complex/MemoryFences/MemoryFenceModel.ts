import { HardwareModel } from '../HardwareModel.ts'
import { MemoryFenceLayout } from './MemoryFenceLayout.ts'

export class MemoryFenceModel {
  private flow = 'none'
  public payload = 0
  public flag = 0
  public wcPending = true
  public loadComplete = true
  public laterExecuted = false

  public publishFlag(sfence: boolean): boolean {
    if (sfence && this.wcPending) {
      this.flow = 'blocked-store'
      return false
    }
    this.flag = 1
    this.flow = 'flag'
    return true
  }
  public completeWc(): void {
    this.payload = 42
    this.wcPending = false
    this.flow = 'wc'
  }
  public issueLoad(): void {
    this.loadComplete = false
    this.flow = 'load-request'
    this.laterExecuted = false
  }
  public completeLoad(): void {
    this.loadComplete = true
    this.flow = 'load'
  }
  public executeLater(lfence: boolean): boolean {
    if (lfence && !this.loadComplete) {
      this.flow = 'blocked-load'
      return false
    }
    this.laterExecuted = true
    this.flow = 'execute'
    return true
  }
  public snapshot(): HardwareModel {
    return new HardwareModel([{ name: 'x86', cells: [
      { id: 'wc', label: 'WC payload', value: `${this.payload}`, status: this.wcPending ? 'write pending' : 'write complete' },
      { id: 'flag', label: 'WB flag', value: `${this.flag}` },
      { id: 'load', label: 'earlier load', value: this.loadComplete ? 'complete' : 'pending' },
      { id: 'later', label: 'later execution', value: this.laterExecuted ? 'executed' : 'waiting', status: this.flow === 'blocked-load' ? 'LFENCE: waiting for earlier load' : undefined },
    ] }], 'Intel x86. Payload uses explicitly write-combining (WC) memory; flag uses write-back (WB). SFENCE orders stores. LFENCE orders loads and has local execution-ordering semantics. No fence here promises persistence.', null, 0, MemoryFenceLayout.create(this.flow))
  }
}
