import { HardwareModel } from '../HardwareModel.ts'
import { LseAtomicLayout } from './LseAtomicLayout.ts'

export class LseAtomicModel {
  private lastCore = -1
  public value = 0
  public old: (number | null)[] = [null, null]
  public operation = ['none', 'none']
  public ldadd(core: number, delta: number): number {
    this.lastCore = core
    const old = this.value
    this.value += delta
    this.old[core] = old
    this.operation[core] = 'LDADDAL'
    return old
  }
  public cas(core: number, expected: number, next: number): boolean {
    this.lastCore = core
    const old = this.value
    if (old === expected) this.value = next
    this.old[core] = old
    this.operation[core] = old === expected ? 'CASAL matched' : 'CASAL mismatch'
    return old === expected
  }
  public swp(core: number, next: number): number {
    this.lastCore = core
    const old = this.value
    this.value = next
    this.old[core] = old
    this.operation[core] = 'SWPAL'
    return old
  }
  public snapshot(): HardwareModel {
    return new HardwareModel([
      { name: 'LSE', cells: [{ id: 'counter', label: 'shared counter', value: `${this.value}` }] },
      { name: 'Core 0', cells: [{ id: 'old-0', label: 'returned old', value: `${this.old[0] ?? '?'}`, status: this.operation[0] }] },
      { name: 'Core 1', cells: [{ id: 'old-1', label: 'returned old', value: `${this.old[1] ?? '?'}`, status: this.operation[1] }] },
    ], 'Arm FEAT_LSE required (for example Neoverse N1). Aligned shared Normal cacheable memory. CASAL, SWPAL, and LDADDAL select acquire/release variants. Each event is one architectural atomic operation. No internal retry, arbitration, cycle count, or speedup is inferred.', null, 0, LseAtomicLayout.create(this.lastCore, this.operation))
  }
}
