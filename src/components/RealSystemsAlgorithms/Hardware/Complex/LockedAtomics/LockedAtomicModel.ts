import { HardwareModel } from '../HardwareModel.ts'
import { LockedAtomicLayout } from './LockedAtomicLayout.ts'

export class LockedAtomicModel {
  private flow = 'none'
  private flowCore = 0
  private instructions = ['LOCK XADD', 'LOCK XADD']
  private requests = ['no operation', 'no operation']
  public value = 0
  public owner: number | null = null
  public old: (number | null)[] = [null, null]
  public zeroFlag: (boolean | null)[] = [null, null]

  public acquire(core: number): boolean {
    this.flowCore = core
    if (this.owner !== null) {
      this.flow = 'wait'
      return false
    }
    this.flow = 'acquire'
    this.owner = core
    return true
  }
  public xadd(core: number, delta: number): number {
    this.requireOwner(core)
    this.instructions[core] = 'LOCK XADD'
    this.requests[core] = `LOCK XADD counter, add = ${delta}`
    this.flow = 'update'
    this.flowCore = core
    const old = this.value
    this.value += delta
    this.old[core] = old
    this.owner = null
    return old
  }
  public cmpxchg(core: number, accumulator: number, next: number): boolean {
    this.requireOwner(core)
    this.instructions[core] = 'LOCK CMPXCHG'
    this.requests[core] = `LOCK CMPXCHG counter, expected = ${accumulator}, new = ${next}`
    this.flow = 'update'
    this.flowCore = core
    this.old[core] = this.value
    const matched = this.value === accumulator
    this.flow = matched ? 'update' : 'compare'
    if (matched) this.value = next
    this.zeroFlag[core] = matched
    this.owner = null
    return matched
  }
  private requireOwner(core: number): void {
    if (this.owner !== core) throw new Error('Acquire exclusive access first')
  }
  public snapshot(): HardwareModel {
    return new HardwareModel([{ name: 'x86', cells: [
      { id: 'counter', label: 'counter', value: `${this.value}` },
      { id: 'owner', label: 'atomic access', value: this.owner === null ? 'available' : `Core ${this.owner}` },
      { id: 'old-0', label: 'core 0 old', value: `${this.old[0] ?? '?'}`, status: `ZF: ${this.zeroFlag[0] ?? '?'}` },
      { id: 'old-1', label: 'core 1 old', value: `${this.old[1] ?? '?'}`, status: `ZF: ${this.zeroFlag[1] ?? '?'}` },
    ] }], 'Intel x86 LOCK XADD / LOCK CMPXCHG, aligned WB operand wholly within one cache line. Exclusive cache access illustrates cache locking; it is not an external bus lock. Atomicity and locked-operation memory ordering are architectural; ownership timing is illustrative. No persistence guarantee.', null, 0, LockedAtomicLayout.create(this.flow, this.flowCore, this.instructions, this.old, this.requests))
  }
}
