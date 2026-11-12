import { HardwareModel } from '../HardwareModel.ts'
import { DsbLayout } from './DsbLayout.ts'

export class DsbModel {
  public cleanPending = false
  public cleanComplete = false
  public continued = false
  public pouValue = 0
  public barrier = 'not reached'
  private flow = 'none'
  public issueClean(): void {
    this.cleanPending = true
    this.flow = 'request'
  }
  public reachPou(): void {
    if (!this.cleanPending) throw new Error('No pending cache clean')
    this.pouValue = 42
    this.flow = 'clean'
  }
  public completeClean(): void {
    if (!this.cleanPending) throw new Error('No pending cache clean')
    this.pouValue = 42
    this.cleanPending = false
    this.cleanComplete = true
    this.flow = 'ack'
  }
  public continueAfter(barrier: 'DMB ISH' | 'DSB ISH'): boolean {
    this.barrier = barrier
    if (barrier === 'DSB ISH' && this.cleanPending) {
      this.flow = 'wait'
      return false
    }
    this.continued = true
    this.flow = 'continue'
    return true
  }
  public snapshot(): HardwareModel {
    return new HardwareModel([{ name: 'Hardware', cells: [
      { id: 'clean-request', label: 'maintenance instruction', value: 'DC CVAU, x0', status: this.cleanPending || this.cleanComplete ? 'issued' : 'next instruction' },
      { id: 'cache-clean', label: 'cache line / data', value: '42', status: this.cleanComplete ? 'clean complete' : this.cleanPending ? 'clean pending' : 'dirty line' },
      { id: 'pou', label: 'same memory location', value: `${this.pouValue}`, status: 'Point of Unification' },
      { id: 'barrier', label: 'CPU barrier', value: this.barrier, status: this.barrier === 'DSB ISH' && this.cleanPending ? 'blocked on completion' : this.barrier === 'not reached' ? 'not issued' : 'may continue' },
      { id: 'continue', label: 'following CPU instruction', value: 'ADD x2, x2, #1', status: this.continued ? 'executed' : 'not executed' },
    ] }], null, 0, DsbLayout.create(this.flow))
  }
}
