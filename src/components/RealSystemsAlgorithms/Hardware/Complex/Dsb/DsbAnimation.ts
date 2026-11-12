import { HardwareInformation, HardwareLesson } from '../HardwareLesson.ts'
import type { HardwareTrace } from '../HardwareLesson.ts'
import { DsbModel } from './DsbModel.ts'

export class DsbAnimation extends HardwareLesson {
  public readonly title = 'Data Synchronization Barrier: DSB'
  public static describe() {
    return HardwareInformation.create('Data Synchronization Barrier: DSB',
      'Ordering accesses is insufficient when later execution requires maintenance to have finished. DSB waits for the relevant operations to complete before execution continues.',
      'Armv8-A AArch64', HardwareInformation.arm, 'Arm distinguishes DMB ordering from DSB completion constraints and documents option-dependent scope.',
      'One cache-line clean, Inner Shareable domain, DSB ISH. The diagram separates the CPU, data cache, Point of Unification, and backing RAM. DC CVAU targets PoU, which can be a cache; it need not flush RAM. Request, data transfer, and completion are conceptual events, not measured cycles. No device protocol, TLB shootdown, instruction synchronization, or persistence claim.')
  }
  protected build(trace: HardwareTrace): void {
    let model = new DsbModel()
    trace.record(model.snapshot(), 'Locate the CPU, cache, and memory', 'Core 0 has a dirty data-cache line containing 42. The Point of Unification still holds 0. Compare how DMB and DSB affect the following ADD instruction.', 'D-cache[x0] = 42; PoU[x0] = 0\nDC CVAU,x0\nbarrier\nADD x2,x2,#1', 0)
    model.issueClean()
    trace.record(model.snapshot(), 'CPU sends a clean request', 'Follow the arrow from the CPU instruction to its data cache. The cache clean has been requested but data has not reached PoU.', 'CPU -> D-cache: DC CVAU,x0')
    model.continueAfter('DMB ISH')
    trace.record(model.snapshot(), 'DMB lets the CPU continue early', 'The CPU executes ADD while PoU still holds 0 and the cache clean remains pending. DMB orders accesses without waiting for this maintenance to complete.', 'DMB ISH\nADD x2,x2,#1 // executes while clean is pending')
    model.reachPou()
    trace.record(model.snapshot(), 'Cache sends the dirty line to PoU', 'The data arrow carries 42 from the data cache to the memory-system Point of Unification. This point may itself be a cache; no RAM flush is required.', 'D-cache -> PoU: data 42')
    model.completeClean()
    trace.record(model.snapshot(), 'Completion returns after ADD', 'The memory system reports completion to the CPU. In the DMB run, ADD already executed before this response.', 'PoU -> CPU: clean completion')
    model = new DsbModel()
    trace.record(model.snapshot(), 'Repeat with DSB', 'Reset the same cache and memory location. The following CPU instruction will now wait for clean completion.', 'D-cache[x0] = 42; PoU[x0] = 0\nDC CVAU,x0\nDSB ISH\nADD x2,x2,#1', 0)
    model.issueClean()
    trace.record(model.snapshot(), 'CPU requests the same clean', 'The request follows the same CPU-to-cache path. Changing the barrier changes when execution may continue.', 'CPU -> D-cache: DC CVAU,x0')
    const allowed = model.continueAfter('DSB ISH')
    trace.record(model.snapshot(), 'DSB blocks the following instruction', `ADD may execute: ${allowed}. The CPU waits while its cache clean is pending and PoU still contains 0.`, 'DSB ISH // wait for clean completion\nADD x2,x2,#1 // blocked')
    model.reachPou()
    trace.record(model.snapshot(), 'Dirty data reaches PoU', 'The cache-to-memory-system arrow transfers 42. The CPU is still waiting for the completion response.', 'D-cache -> PoU: data 42\nCPU: still waiting')
    model.completeClean()
    trace.record(model.snapshot(), 'Memory system acknowledges completion', 'The completion arrow returns to the CPU barrier. The required clean is complete; this is not a persistence guarantee.', 'PoU -> CPU: clean completion')
    model.continueAfter('DSB ISH')
    trace.record(model.snapshot(), 'Only now can the CPU execute ADD', 'DSB completes and releases the next instruction. Compare the CPU execution arrow with the earlier DMB run: this ADD follows the cache-clean completion response.', 'DSB ISH returns\nADD x2,x2,#1 // now executes', 2)
  }
}
