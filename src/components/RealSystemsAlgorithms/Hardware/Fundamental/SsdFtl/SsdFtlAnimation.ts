import { ComponentInformation, ComponentLesson } from '../ComponentLesson.ts'
import type { HardwareTrace } from '../HardwareTrace.ts'
import { SsdFtlModel } from './SsdFtlModel.ts'
import { SsdFtlOverview } from './SsdFtlOverview.ts'

export class SsdFtlAnimation extends ComponentLesson {
  public readonly title = SsdFtlOverview.describe().name
  public static describe() { return ComponentInformation.describe(SsdFtlOverview.describe()) }

  protected build(trace: HardwareTrace): void {
    const model = new SsdFtlModel()
    trace.record(model.snapshot(), 'Logical and physical state', 'Two host writes already mapped logical pages zero and one to separate physical pages. Other flash pages are erased.', 'L2P[0] = B0.P0  // A\nL2P[1] = B0.P1  // B', 0)
    model.lookup(0)
    trace.record(model.snapshot(), 'Look up logical page zero', 'The host logical address resolves through the L2P entry; it does not directly name a fixed NAND page.', 'physical = L2P[0]')
    model.read(0)
    trace.record(model.snapshot(), 'Read the current copy', 'Logical page zero currently returns A from physical B0 P0.', 'return NAND.read(L2P[0])  // A')
    const destination = model.allocate()
    trace.record(model.snapshot(), 'Allocate erased space', 'Select a different free physical page for A2. The current mapping still points to A.', 'destination = first_erased_page()\nL2P[0] remains B0.P0')
    model.program(0, 'A2', destination)
    trace.record(model.snapshot(), 'Program before publishing', 'A2 is programmed but staged. The previous page remains valid and the mapping still points to it.', 'NAND.program(destination, A2)\nwait_for_success()\nkeep_old_mapping()')
    model.commit()
    trace.record(model.snapshot(), 'Publish the replacement', 'After programming succeeds, update L2P and invalidate the old page. No containing block has been erased.', 'old = L2P[0]\nL2P[0] = destination\nmark_invalid(old)')
    model.lookup(0)
    trace.record(model.snapshot(), 'Resolve the same logical address', 'Logical page zero now resolves to its replacement physical page.', 'physical = L2P[0]  // replacement')
    model.read(0)
    trace.record(model.snapshot(), 'Return the updated data', 'The unchanged host address now returns A2.', 'return NAND.read(L2P[0])  // A2')
    const failed = model.allocate()
    model.program(0, 'A3', failed, true, false)
    trace.record(model.snapshot(), 'A failed program must not publish', 'The injected failure quarantines its destination. Logical page zero still maps to the successful A2 copy; failure does not invalidate it.', 'if NAND.program_fails(candidate):\n  quarantine(candidate)\n  keep L2P[0] unchanged')
    model.read(0)
    trace.record(model.snapshot(), 'Preserve the last successful mapping', 'A2 is still readable after the failed attempt. This ordinary logical completion says nothing about power-loss recovery of mapping metadata.', 'assert read(0) == A2\n// crash recovery is outside this example', 2)
  }
}
