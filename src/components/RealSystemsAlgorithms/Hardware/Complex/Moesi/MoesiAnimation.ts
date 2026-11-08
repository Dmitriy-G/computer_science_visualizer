import { HardwareInformation, HardwareLesson } from '../HardwareLesson.ts'
import type { HardwareTrace } from '../HardwareLesson.ts'
import { MoesiModel } from './MoesiModel.ts'

export class MoesiAnimation extends HardwareLesson {
  public readonly title = 'MOESI cache coherence'
  public static describe() {
    return HardwareInformation.create('MOESI cache coherence',
      'Caches can hold several copies of one line, including a dirty copy. MOESI tracks ownership, sharing, and invalidation so readers receive the current data.',
      'Arm Cortex-A53', 'https://documentation-service.arm.com/static/6040c321ee937942ba301626',
      'The Cortex-A53 TRM documents MOESI for coherent L1 data caches.',
      'Three conceptual coherent caches and one line containing x and y. Stable states only; no transient messages, directory, races, timing, or replacement algorithm. Owned permits shared dirty data with memory behind. False sharing invalidates the whole line. This documented implementation does not define the protocol of all Arm processors.')
  }
  protected build(trace: HardwareTrace): void {
    const model = new MoesiModel()
    trace.record(model.snapshot(), 'No cached copies', 'Memory contains x=0,y=0 and all cache copies are Invalid.', 'C0=I; C1=I; C2=I', 0)
    model.read(0)
    trace.record(model.snapshot(), 'Read obtains Exclusive', 'The sole clean cached copy can be Exclusive.', 'C0 read x: I -> E')
    model.write(0, 'x', 1)
    trace.record(model.snapshot(), 'Write creates Modified', 'Core 0 owns the dirty line; memory can still contain the old value.', 'C0 write x=1: E -> M')
    model.read(1)
    trace.record(model.snapshot(), 'Dirty owner shares data', 'Core 0 becomes Owned and forwards current data to core 1 Shared. Memory remains stale.', 'C0 M -> O; C1 I -> S')
    model.read(2)
    trace.record(model.snapshot(), 'Owned forwards to another reader', 'The dirty owner supplies x=1 without requiring this teaching trace to write it back first.', 'C0 O -> O; C2 I -> S')
    model.write(1, 'y', 2)
    trace.record(model.snapshot(), 'False sharing invalidates a line', 'Core 1 changes y, but x shares its line. Both other copies are invalidated even though core 0 was working on x.', 'C1 write y=2: S -> M\nC0,C2 -> I')
    model.read(2, 'y')
    trace.record(model.snapshot(), 'Share the new dirty line', 'Core 1 becomes Owned and forwards both x=1 and y=2.', 'C1 M -> O; C2 I -> S')
    model.evict(1)
    trace.record(model.snapshot(), 'Evict the dirty owner', 'Write back the current line before discarding its Owned copy. Core 2 keeps a valid Shared copy.', 'C1 O -> I; memory=(1,2)', 2)
  }
}
