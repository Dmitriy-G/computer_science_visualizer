import { HardwareInformation, HardwareLesson } from '../HardwareLesson.ts'
import type { HardwareTrace } from '../HardwareLesson.ts'
import { MesifModel } from './MesifModel.ts'

export class MesifAnimation extends HardwareLesson {
  public readonly title = 'MESIF cache coherence'
  public static describe() {
    return HardwareInformation.create('MESIF cache coherence',
      'Several clean shared copies could all respond to a read request. MESIF adds a Forward state to designate a responder while preserving exclusive write ownership.',
      'Intel Xeon 7500-series QuickPath', 'https://www.intel.com/content/dam/www/public/us/en/documents/datasheets/xeon-processor-7500-series-vol-2-datasheet.pdf',
      'The Xeon 7500-series datasheet describes the MESIF protocol and Forward state in its QuickPath/LLC coherence discussion.',
      'Three abstract coherent agents, one line. Not a model of every private-cache level, snoop filter, or all Intel CPUs. This teaching policy retains the existing forwarder and reassigns it on eviction; vendor responder selection and transient states are not claimed. Unlike MOESI Owned, Forward is clean.')
  }
  protected build(trace: HardwareTrace): void {
    const model = new MesifModel()
    trace.record(model.snapshot(), 'Select a shared responder', 'Begin with all copies Invalid and memory x=0,y=0.', 'MESIF: M,E,S,I,F', 0)
    model.read(0)
    trace.record(model.snapshot(), 'One reader obtains Exclusive', 'Core 0 holds the only clean copy.', 'C0 I -> E')
    model.read(1)
    trace.record(model.snapshot(), 'Designate a Forward copy', 'The lesson chooses core 0 as the clean Forward responder; core 1 is Shared.', 'C0 E -> F; C1 I -> S')
    model.read(2)
    trace.record(model.snapshot(), 'Forwarder supplies another read', 'Core 0 supplies the line; other Shared copies do not all need to respond.', 'C0 F supplies C2; C2 I -> S')
    model.evict(0)
    trace.record(model.snapshot(), 'Forwarder eviction', 'This deterministic policy assigns core 1 as the new clean forwarder. Actual responder policies are implementation-specific.', 'C0 F -> I; choose C1 S -> F')
    model.write(2, 'x', 7)
    trace.record(model.snapshot(), 'Writer obtains ownership', 'Core 2 invalidates peers and becomes Modified. Clean Forward does not coexist with a dirty writer here.', 'C2 S -> M; peers -> I')
    model.read(0)
    trace.record(model.snapshot(), 'Share a formerly dirty line', 'This stable-state trace writes current data to memory before forming clean Forward/Shared copies. No MOESI Owned state exists in MESIF.', 'write back x=7; C2 M -> F; C0 I -> S', 2)
  }
}
