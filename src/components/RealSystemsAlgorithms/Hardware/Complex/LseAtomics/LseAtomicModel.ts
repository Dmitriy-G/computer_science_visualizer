import { HardwareModel } from '../HardwareModel.ts'
import { LseAtomicLayout } from './LseAtomicLayout.ts'

export class LseAtomicModel {
  private lastCore = -1
  private requests = ['no operation', 'no operation']
  public value = 0
  public old: (number | null)[] = [null, null]
  public operation = ['none', 'none']
  public ldadd(core: number, delta: number): number {
    this.lastCore = core
    const old = this.value
    this.value += delta
    this.old[core] = old
    this.operation[core] = 'LDADDAL'
    this.requests[core] = `LDADDAL counter, add = ${delta}`
    return old
  }
  public cas(core: number, expected: number, next: number): boolean {
    this.lastCore = core
    const old = this.value
    if (old === expected) this.value = next
    this.old[core] = old
    this.operation[core] = old === expected ? 'CASAL matched' : 'CASAL mismatch'
    this.requests[core] = `CASAL counter, expected = ${expected}, new = ${next}`
    return old === expected
  }
  public swp(core: number, next: number): number {
    this.lastCore = core
    const old = this.value
    this.value = next
    this.old[core] = old
    this.operation[core] = 'SWPAL'
    this.requests[core] = `SWPAL counter, new = ${next}`
    return old
  }
  public snapshot(): HardwareModel {
    return new HardwareModel([
      { name: 'LSE', cells: [{ id: 'counter', label: 'shared counter', value: `${this.value}` }] },
      { name: 'Core 0', cells: [{ id: 'old-0', label: 'returned old', value: `${this.old[0] ?? '?'}`, status: this.operation[0] }] },
      { name: 'Core 1', cells: [{ id: 'old-1', label: 'returned old', value: `${this.old[1] ?? '?'}`, status: this.operation[1] }] },
    ], null, 0, LseAtomicLayout.create(this.lastCore, this.operation, this.old, this.requests))
  }
}
