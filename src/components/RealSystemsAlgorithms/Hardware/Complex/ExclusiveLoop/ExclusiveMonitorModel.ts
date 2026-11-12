import { HardwareModel } from '../HardwareModel.ts'
import { ExclusiveMonitorLayout } from './ExclusiveMonitorLayout.ts'

export class ExclusiveMonitorModel {
  private flow = 'none'
  private flowCore = 0
  public value = 0
  public version = 0
  public local = [false, false]
  public global: (number | null)[] = [null, null]
  public loaded = [0, 0]
  public status: (number | null)[] = [null, null]
  public attempts = [0, 0]

  public ldxr(core: number): number {
    this.flow = 'load'
    this.flowCore = core
    this.local[core] = true
    this.global[core] = this.version
    this.loaded[core] = this.value
    this.status[core] = null
    return this.value
  }
  public stxr(core: number, next: number): number {
    const success = this.local[core] && this.global[core] === this.version
    this.local[core] = false
    this.global[core] = null
    this.attempts[core] += 1
    this.status[core] = success ? 0 : 1
    if (success) this.interferingWrite(next)
    this.flow = success ? 'store' : 'fail'
    this.flowCore = core
    return this.status[core]!
  }
  public interferingWrite(value: number): void {
    this.value = value
    this.version += 1
    this.global = [null, null]
  }
  public snapshot(): HardwareModel {
    const banks = []
    for (let core = 0; core < 2; core += 1) banks.push({ name: `Core ${core}`, cells: [
      { id: `local-${core}`, label: 'local monitor', value: this.local[core] ? 'exclusive' : 'open' },
      { id: `global-${core}`, label: 'global match', value: this.global[core] === this.version ? 'valid' : 'invalid' },
      { id: `loaded-${core}`, label: 'loaded / status', value: `${this.loaded[core]} / ${this.status[core] ?? '?'}`, status: `STXR attempts: ${this.attempts[core]}` },
    ] })
    banks.push({ name: 'Shared', cells: [{ id: 'counter', label: 'counter', value: `${this.value}` }] })
    return new HardwareModel(banks, null, 0, ExclusiveMonitorLayout.create(this.flow, this.flowCore, this.value))
  }
}
