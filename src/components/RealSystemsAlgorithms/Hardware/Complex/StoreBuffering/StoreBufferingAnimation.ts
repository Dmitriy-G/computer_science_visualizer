import { HardwareInformation, HardwareLesson } from '../HardwareLesson.ts'
import type { HardwareTrace } from '../HardwareLesson.ts'
import { StoreBufferModel } from './StoreBufferModel.ts'

export class StoreBufferingAnimation extends HardwareLesson {
  public readonly title = 'Store buffering and memory ordering'
  public static describe() {
    return HardwareInformation.create('Store buffering and memory ordering',
      'Stores can wait in per-core buffers while later loads proceed, allowing surprising observations between cores. Explore the two-core store-buffering litmus and its permitted register outcomes.',
      'Intel x86', HardwareInformation.intel, 'The SDM documents store forwarding and Store-to-Load reordering for ordinary write-back memory.',
      'Two cores, two aligned locations, FIFO store buffers, no other accesses. Exhaustive finite interleavings for this litmus only. Coherence is per location; it does not itself order different locations. No measured timing or persistence guarantee.')
  }
  protected build(trace: HardwareTrace): void {
    const model = new StoreBufferModel()
    trace.record(model.snapshot(), 'Two cores, two locations', 'Both registers are unread; shared x and y start at zero.', 'C0: MOV [x],1; MOV r0,[y]\nC1: MOV [y],1; MOV r1,[x]', 0)
    for (let core = 0; core < 2; core += 1) {
      model.advance(core)
      trace.record(model.snapshot(), `Core ${core} buffers a store`, 'The local store has issued but is not yet globally visible.', `C${core}: MOV [${core === 0 ? 'x' : 'y'}],1`)
    }
    trace.record(model.snapshot(), 'Local forwarding', `A same-address load by core 0 would get ${model.load(0, 'x')} from its own buffer; shared x is still ${model.memory.x}. This inspection is outside the litmus.`, 'inspect C0 forwarding: [x] -> 1')
    for (let core = 0; core < 2; core += 1) {
      model.advance(core)
      trace.record(model.snapshot(), `Core ${core} reads zero`, 'A load from the other address bypasses the local pending store.', `C${core}: MOV r${core},[${core === 0 ? 'y' : 'x'}]`)
    }
    model.drain(0)
    trace.record(model.snapshot(), 'Publish x', 'Drain core 0\'s oldest buffered store into coherent shared memory.', 'C0 buffer -> shared x')
    model.drain(1)
    trace.record(model.snapshot(), 'Publish y', 'Draining the stores does not retroactively change the earlier loads.', 'C1 buffer -> shared y')
    trace.record(model.snapshot(), 'Enumerate permitted outcomes', `Exploring every finite instruction/drain interleaving gives (r0,r1): ${model.outcomes().join('; ')}. This trace witnessed (0,0).`, 'explore(enabled instruction steps, FIFO drains)', 2)
  }
}
