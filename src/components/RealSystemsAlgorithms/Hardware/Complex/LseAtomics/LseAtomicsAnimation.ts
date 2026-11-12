import { HardwareInformation, HardwareLesson } from '../HardwareLesson.ts'
import type { HardwareTrace } from '../HardwareLesson.ts'
import { ExclusiveMonitorModel } from '../ExclusiveLoop/ExclusiveMonitorModel.ts'
import { LseAtomicModel } from './LseAtomicModel.ts'

export class LseAtomicsAnimation extends HardwareLesson {
  public readonly title = 'LSE atomics: CAS, SWP, LDADD'
  public static describe() {
    return HardwareInformation.create('LSE atomics: CAS, SWP, LDADD',
      'Contended exclusive updates require explicit retry code. FEAT_LSE provides architectural compare-and-swap, exchange, and fetch-add operations without that software retry loop.',
      'Arm FEAT_LSE / Neoverse N1', HardwareInformation.lse, 'Arm documents FEAT_LSE atomic operations and their availability on Neoverse N1.',
      'Requires FEAT_LSE; it is not universal to AArch64. Uses AL acquire/release variants, not the relaxed base forms. Shows architectural results only. No claim about internal implementation, hidden retries, measured performance, or universal superiority over exclusive loops.')
  }
  protected build(trace: HardwareTrace): void {
    const loop = new ExclusiveMonitorModel()
    trace.record(loop.snapshot(), 'Software exclusive loop', 'First compare two competing increments using exclusive instructions.', 'LDXR; ADD; STXR; CBNZ retry', 0)
    loop.ldxr(0)
    trace.record(loop.snapshot(), 'Core 0 loads exclusively', 'The memory-to-core arrow returns counter 0 and establishes its monitor condition.', 'C0: LDXR -> 0')
    loop.ldxr(1)
    trace.record(loop.snapshot(), 'Core 1 loads the same counter', 'Both cores now hold 0, with independent local monitor conditions.', 'C1: LDXR -> 0')
    loop.stxr(0, 1)
    trace.record(loop.snapshot(), 'Core 0 stores and invalidates the competing reservation', 'Counter becomes 1. The invalidation arrow marks core 1\'s global condition invalid.', 'C0: STXR 1 -> status 0')
    loop.stxr(1, 1)
    trace.record(loop.snapshot(), 'Interference requires a retry', 'Core 1\'s STXR failed and the counter remains 1.', 'C0: STXR succeeds\nC1: STXR fails')
    loop.ldxr(1)
    trace.record(loop.snapshot(), 'Retry reads the updated counter', 'Core 1 reads 1 through a new exclusive load before computing 2.', 'C1: LDXR -> 1\nADD -> 2')
    loop.stxr(1, loop.loaded[1] + 1)
    trace.record(loop.snapshot(), 'Exclusive loop completes', 'Counter reaches 2 after software retries. These are instruction events, not cycle counts.', 'C1: LDXR; ADD; STXR -> success')
    const model = new LseAtomicModel()
    trace.record(model.snapshot(), 'Restart with LSE', 'The counter starts again at zero. AL variants explicitly request acquire/release ordering. Diagram transfers show presentation stages of each indivisible instruction, without exposing internal implementation.', 'MOV wDelta,#1\nLDADDAL wDelta,wOld,[counter]', 0)
    for (let core = 0; core < 2; core += 1) {
      const old = model.ldadd(core, 1)
      trace.record(model.snapshot(), `Core ${core}: LDADDAL`, `Atomically return old=${old} and add one. There is no software STXR-status retry in this instruction sequence.`, `C${core}: LDADDAL 1 -> old ${old}`)
    }
    model.cas(0, 0, 9)
    trace.record(model.snapshot(), 'CASAL mismatch', 'Expected 0 differs from counter 2. CAS returns the actual old value in the expected register and leaves memory unchanged.', 'CASAL expected=0,new=9 -> old=2')
    model.cas(0, 2, 9)
    trace.record(model.snapshot(), 'CASAL matches', 'Expected 2 matches; the indivisible comparison and update store 9.', 'CASAL expected=2,new=9 -> old=2')
    model.swp(1, 5)
    trace.record(model.snapshot(), 'SWPAL exchanges values', 'Exchange 9 for 5 and return 9. CAS, SWP, and LDADD solve different updates; ordering comes from their suffixes.', 'SWPAL new=5 -> old=9', 2)
  }
}
