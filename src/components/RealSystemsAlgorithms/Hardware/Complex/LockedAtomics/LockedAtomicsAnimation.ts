import { HardwareInformation, HardwareLesson } from '../HardwareLesson.ts'
import type { HardwareTrace } from '../HardwareLesson.ts'
import { LockedAtomicModel } from './LockedAtomicModel.ts'

export class LockedAtomicsAnimation extends HardwareLesson {
  public readonly title = 'Locked atomic read-modify-write'
  public static describe() {
    return HardwareInformation.create('Locked atomic read-modify-write',
      'Concurrent read-modify-write sequences can overwrite one another. LOCK XADD and LOCK CMPXCHG provide indivisible updates with x86 locked-operation ordering.',
      'Intel x86', HardwareInformation.intel, 'The SDM documents locked operations, ordering, and cache locking for suitable cacheable operands.',
      'Two cores, one aligned WB operand inside a cache line. The exclusive-access marker is conceptual, not a model of lock arbitration. Unsuitable or uncacheable accesses and split/bus locks are outside the lesson. No exact coherence protocol or performance is assumed.')
  }
  protected build(trace: HardwareTrace): void {
    const model = new LockedAtomicModel()
    trace.record(model.snapshot(), 'Two cores update one counter', 'A plain read plus write can lose an increment. Locked instructions make each update indivisible.', 'C0 and C1: LOCK XADD [counter],1', 0)
    model.acquire(0)
    trace.record(model.snapshot(), 'Core 0 obtains exclusive access', 'A suitable WB operand can be locked through cache coherence rather than an external bus lock.', 'C0: obtain exclusive cache access')
    const acquired = model.acquire(1)
    trace.record(model.snapshot(), 'The competing update waits', `Core 1 acquired access: ${acquired}. It cannot interleave inside core 0\'s atomic update.`, 'C1: wait for atomic access')
    model.xadd(0, 1)
    trace.record(model.snapshot(), 'Core 0 commits XADD', 'Return old value 0 and publish counter 1 as one indivisible update.', 'C0: LOCK XADD -> old=0, counter=1')
    model.acquire(1)
    trace.record(model.snapshot(), 'Core 1 obtains exclusive access', 'The first update has released access, so core 1 can begin its own atomic operation.', 'C1: obtain exclusive cache access')
    model.xadd(1, 1)
    trace.record(model.snapshot(), 'Core 1 commits XADD', 'The second update reads 1 and publishes 2, preserving both increments.', 'C1: LOCK XADD -> old=1, counter=2')
    model.acquire(0)
    trace.record(model.snapshot(), 'Core 0 obtains access for comparison', 'Acquire exclusive access before comparing the counter with the accumulator.', 'C0: obtain exclusive cache access')
    model.cmpxchg(0, 0, 8)
    trace.record(model.snapshot(), 'CMPXCHG fails comparison', 'Accumulator 0 mismatches memory 2. ZF=0; accumulator receives 2, memory stays 2.', 'LOCK CMPXCHG expected=0,new=8')
    model.acquire(0)
    trace.record(model.snapshot(), 'Core 0 obtains access for another comparison', 'The next comparison uses the updated expected value 2.', 'C0: obtain exclusive cache access')
    model.cmpxchg(0, 2, 8)
    trace.record(model.snapshot(), 'CMPXCHG succeeds', 'Accumulator 2 matches memory 2. ZF=1 and memory becomes 8 atomically.', 'LOCK CMPXCHG expected=2,new=8', 2)
  }
}
