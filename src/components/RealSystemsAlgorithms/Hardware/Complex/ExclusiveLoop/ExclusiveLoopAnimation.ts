import { HardwareInformation, HardwareLesson } from '../HardwareLesson.ts'
import type { HardwareTrace } from '../HardwareLesson.ts'
import { ExclusiveMonitorModel } from './ExclusiveMonitorModel.ts'

export class ExclusiveLoopAnimation extends HardwareLesson {
  public readonly title = 'Exclusive retry loop: LDXR/STXR'
  public static describe() {
    return HardwareInformation.create('Exclusive retry loop: LDXR/STXR',
      'Two concurrent increments can lose an update. Load-exclusive and store-exclusive detect interference, allowing a failed update to retry using the new value.',
      'Arm AArch64', HardwareInformation.lse, 'Arm documents exclusive-load/store loops and contrasts them with LSE atomic instructions.',
      'Two cores, one aligned shared counter and one abstract reservation granule. Local/global roles are distinguished without claiming physical placement or actual granule size. Real exclusive stores may fail spuriously. No progress or retry-count bound is claimed for real hardware; the trace has exactly one interference. Plain instructions do not supply acquire/release ordering.')
  }
  protected build(trace: HardwareTrace): void {
    const model = new ExclusiveMonitorModel()
    trace.record(model.snapshot(), 'Two increments compete', 'Each increment needs an indivisible read-modify-write.', 'retry: LDXR wOld,[counter]\nADD wNew,wOld,#1\nSTXR wStatus,wNew,[counter]\nCBNZ wStatus,retry', 0)
    for (let core = 0; core < 2; core += 1) {
      model.ldxr(core)
      trace.record(model.snapshot(), `Core ${core} establishes exclusivity`, `LDXR returns ${model.loaded[core]}. The local monitor is exclusive and the global condition currently matches.`, `C${core}: LDXR -> ${model.loaded[core]}`)
    }
    model.stxr(0, model.loaded[0] + 1)
    trace.record(model.snapshot(), 'Core 0 succeeds', 'STXR returns status 0 and stores 1 atomically. Its write invalidates core 1\'s global exclusive condition.', 'C0: STXR 1 -> status 0')
    model.stxr(1, model.loaded[1] + 1)
    trace.record(model.snapshot(), 'Core 1 fails without writing', 'STXR returns nonzero. Counter remains 1; a failed exclusive store cannot overwrite it.', 'C1: STXR 1 -> status 1\nCBNZ status,retry')
    model.ldxr(1)
    trace.record(model.snapshot(), 'Retry with a fresh value', 'Core 1 establishes a new exclusive condition and reads 1.', 'C1: LDXR -> 1\nADD -> 2')
    model.stxr(1, model.loaded[1] + 1)
    trace.record(model.snapshot(), 'Both increments preserved', `The counter is ${model.value}. Use LDAXR/STLXR or the required barriers when the update also synchronizes other data.`, 'C1: STXR 2 -> status 0', 2)
  }
}
