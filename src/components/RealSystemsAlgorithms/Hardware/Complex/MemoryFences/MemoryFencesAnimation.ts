import { HardwareInformation, HardwareLesson } from '../HardwareLesson.ts'
import type { HardwareTrace } from '../HardwareLesson.ts'
import { StoreBufferModel } from '../StoreBuffering/StoreBufferModel.ts'
import { MemoryFenceModel } from './MemoryFenceModel.ts'

export class MemoryFencesAnimation extends HardwareLesson {
  public readonly title = 'Memory fences: MFENCE, SFENCE, LFENCE'
  public static describe() {
    return HardwareInformation.create('Memory fences: MFENCE, SFENCE, LFENCE',
      'Buffered and weakly ordered accesses can become visible in an unintended order. Compare MFENCE load/store ordering, SFENCE store ordering, and LFENCE load and local execution ordering.',
      'Intel x86', HardwareInformation.intel, 'The SDM defines memory-ordering and fence behavior, including weakly ordered stores.',
      'The store-buffer litmus uses WB memory; a separate SFENCE example explicitly uses WC payload and WB flag. LFENCE is not a store-buffer drain; SFENCE does not impose Store-to-Load ordering. Fences are neither general cache flushes nor persistence guarantees.')
  }
  protected build(trace: HardwareTrace): void {
    const model = new StoreBufferModel('MFENCE')
    trace.record(model.snapshot(), 'Insert MFENCE on both cores', 'Each core stores, fences, then loads the other address.', 'MOV [own],1\nMFENCE\nMOV r,[other]', 0)
    for (let core = 0; core < 2; core += 1) {
      model.advance(core)
      trace.record(model.snapshot(), `Core ${core} buffers its store`, 'MFENCE must order this earlier store before the later load.', `C${core}: buffer store`)
    }
    const crossed = model.advance(0)
    trace.record(model.snapshot(), 'MFENCE waits', `Core 0 can cross its fence: ${crossed}. Its store is still pending.`, 'MFENCE: wait for earlier accesses')
    for (let core = 0; core < 2; core += 1) {
      model.drain(core)
      trace.record(model.snapshot(), `Core ${core} publishes its store`, 'The buffered write becomes visible before this core crosses MFENCE.', `drain C${core}`)
      model.advance(core)
      trace.record(model.snapshot(), `Core ${core} crosses MFENCE`, 'The earlier store is now visible, so the fence releases the following load.', `C${core}: MFENCE`)
      model.advance(core)
      trace.record(model.snapshot(), `Core ${core} performs its later load`, 'Read the other core\'s location after the local fence.', `C${core}: load`)
    }
    for (const fence of ['none', 'MFENCE', 'SFENCE', 'LFENCE'] as const) {
      trace.explain(`Exhaustive (r0,r1) outcomes with ${fence} on both cores: ${new StoreBufferModel(fence).outcomes().join('; ')}.`)
    }
    let wc = new MemoryFenceModel()
    trace.record(wc.snapshot(), 'Restart with a WC payload and WB flag', 'Begin a separate memory-type example with a buffered payload and an unpublished flag.', 'WC payload pending; WB flag=0', 0)
    wc.publishFlag(false)
    trace.record(wc.snapshot(), 'WC payload without SFENCE', 'The WB flag can become visible while the WC payload write remains pending. This is a different memory type from the litmus.', 'MOV [WC payload],42\nMOV [WB flag],1')
    wc = new MemoryFenceModel()
    trace.record(wc.snapshot(), 'Repeat with SFENCE', 'Reset the payload and flag before adding store ordering.', 'WC payload pending; WB flag=0', 0)
    const published = wc.publishFlag(true)
    trace.record(wc.snapshot(), 'SFENCE orders stores', `Flag publication allowed: ${published}. The earlier WC payload store must be ordered first.`, 'MOV [WC payload],42\nSFENCE\nMOV [WB flag],1')
    wc.completeWc()
    trace.record(wc.snapshot(), 'Publish the WC payload', 'The earlier payload write reaches shared memory before flag publication.', 'complete WC store')
    wc.publishFlag(true)
    trace.record(wc.snapshot(), 'Payload before flag', 'The payload store completes before the flag is published in this example.', 'complete WC store; publish flag')
    wc.issueLoad()
    trace.record(wc.snapshot(), 'Issue an earlier load', 'Now compare local execution ordering. A separate load has started and is waiting for its data.', 'MOV r,[address] // pending')
    const executed = wc.executeLater(true)
    trace.record(wc.snapshot(), 'LFENCE waits for an earlier load', `Later local execution allowed: ${executed}. LFENCE waits for prior instructions to complete locally; it does not make earlier stores globally visible.`, 'MOV r,[address]\nLFENCE\nlater instruction')
    wc.completeLoad()
    trace.record(wc.snapshot(), 'Memory returns the earlier load', 'The response arrow returns data from memory to the pending CPU load. LFENCE can now complete locally.', 'memory -> CPU: load response')
    wc.executeLater(true)
    trace.record(wc.snapshot(), 'Choose the required ordering', 'MFENCE orders loads and stores, SFENCE orders stores, and LFENCE orders loads with local execution constraints. They are not interchangeable.', 'earlier load completes; LFENCE; later instruction', 2)
  }
}
