import { CpuLesson, CpuLessonInformation } from '../Cpu/CpuLesson.ts'
import type { HardwareTrace } from '../HardwareTrace.ts'
import { OutOfOrderModel } from './OutOfOrderModel.ts'

export class OutOfOrderAnimation extends CpuLesson {
  public readonly title = 'Out-of-order execution'

  public static describe() {
    return CpuLessonInformation.create('Out-of-order execution',
      'A slow instruction can stall unrelated work and leave execution units idle. Execute ready independent instructions early, then retire results in program order and discard wrong-path results.',
      'Intel Core', 'https://cdrdv2-public.intel.com/814198/248966-Optimization-Reference-Manual-V1-049.pdf',
      'Intel documents out-of-order execution and in-order retirement in its processor architecture descriptions.',
      'Five illustrative operations use seven physical registers and preassigned renamed operands. The PRF stores values; the ROB tracks completion and in-order retirement. Committed mappings select architectural values. Branch recovery restores surviving mappings and releases wrong-path destinations. Execution widths, address translation, cache behavior, and memory latency are not simulated.')
  }

  protected build(trace: HardwareTrace): void {
    const model = new OutOfOrderModel()
    trace.record(model.snapshot(), 'Dispatch in program order', 'Instructions already have captured physical operands and allocated ROB / issue-queue entries. I1 is a slow load. I4 is predicted not taken, so I5 enters the speculative window.', 'ROB = [I1, I2, I3, I4, I5]\npredict(I4) = not_taken', 0)
    model.requestLoad()
    trace.record(model.snapshot('I1'), 'Issue I1 to the data-access path', 'The scheduler issues I1 to the load/store and data-cache path using symbolic address A. Hold this teaching load pending while independent work executes.', 'issue(I1): load [A]')
    model.execute('I3')
    trace.record(model.snapshot('I3'), 'True dependency blocks I3', 'I3 cannot execute until I1 supplies r1. Out-of-order execution must preserve data dependencies.', 'if !ready(I1.result): wait(I3)')
    for (const id of ['I2', 'I5']) {
      model.execute(id)
      trace.record(model.snapshot(id), `Execute ${id} early`, 'The ready instruction executes before I1 finishes. Write its speculative result to the PRF, then mark its ROB entry complete.', 'if operands_ready: PRF[dst] = execute(); ROB[id].complete = true')
    }
    model.retireNext()
    trace.record(model.snapshot('I1'), 'Retirement waits for the head', 'I2 and I5 are complete, but neither may update architectural registers while I1 is incomplete.', 'if !ROB.head.complete: stall_retirement()')
    for (const id of ['I1', 'I3', 'I4']) {
      model.execute(id)
      trace.record(model.snapshot(id), id === 'I4' ? 'Branch recovery' : `Complete ${id}`,
        id === 'I4' ? 'I4 is actually taken. Discard I5 and its p6 value 99, restore surviving rename mappings, and redirect fetch to 0x200.' : 'The computed PRF value becomes available to dependent instructions, even before retirement.',
        id === 'I4' ? 'if actual != predicted:\n  squash_younger(I4); restore_rename_map(); PC = 0x200' : 'PRF[dst] = execute(id); ROB[id].complete = true; wake_dependents(id)')
    }
    for (let index = 0; index < 4; index += 1) {
      const id = model.retireNext()!
      trace.record(model.snapshot(id), `Retire ${id}`, 'Only the oldest completed, unsquashed operation can retire. Register-writing instructions update committed mappings and release their superseded physical registers.', 'commit_mapping(ROB.head); free_superseded_register(); advance_head()')
    }
    trace.explain('Committed r1 = 10, r2 = 7, r3 = 11. I5 computed 99 but was squashed; r2 never becomes 99.')
  }
}
