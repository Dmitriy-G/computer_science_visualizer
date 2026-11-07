import { CpuLesson, CpuLessonInformation } from '../CpuLesson.ts'
import type { CpuTrace } from '../CpuTrace.ts'
import { OutOfOrderModel } from './OutOfOrderModel.ts'

export class OutOfOrderAnimation extends CpuLesson {
  public readonly title = 'Out-of-order execution'

  public static describe() {
    return CpuLessonInformation.create('Out-of-order execution',
      'Execute independent instructions while an older operation waits, then retire in order and discard wrong-path results.',
      'Intel Core', 'https://cdrdv2-public.intel.com/814198/248966-Optimization-Reference-Manual-V1-049.pdf',
      'Intel documents out-of-order execution and in-order retirement in its processor architecture descriptions.',
      'Five illustrative operations model a reorder buffer and branch recovery. Execution widths, memory latency, and physical renaming are omitted here; the register-renaming lesson covers operand identities.')
  }

  protected build(trace: CpuTrace): void {
    const model = new OutOfOrderModel()
    trace.record(model.snapshot(), 'Dispatch in program order', 'I1 is a slow load. I4 is predicted not taken, so I5 enters the speculative window.', 'ROB = [I1, I2, I3, I4, I5]\npredict(I4) = not_taken', 0)
    model.execute('I3')
    trace.record(model.snapshot('I3'), 'True dependency blocks I3', 'I3 cannot execute until I1 supplies r1. Out-of-order execution must preserve data dependencies.', 'if !ready(I1.result): wait(I3)')
    for (const id of ['I2', 'I5']) {
      model.execute(id)
      trace.record(model.snapshot(id), `Execute ${id} early`, 'The ready instruction executes before I1 finishes. Its result remains speculative in the reorder buffer.', 'if operands_ready: execute(); mark_complete()')
    }
    model.retireNext()
    trace.record(model.snapshot('I1'), 'Retirement waits for the head', 'I2 and I5 are complete, but neither may update architectural registers while I1 is incomplete.', 'if !ROB.head.complete: stall_retirement()')
    for (const id of ['I1', 'I3', 'I4']) {
      model.execute(id)
      trace.record(model.snapshot(id), id === 'I4' ? 'Branch recovery' : `Complete ${id}`,
        id === 'I4' ? 'I4 is actually taken. Discard the younger I5 result 99 and redirect fetch to 0x200.' : 'The computed result becomes available to dependent instructions, even before retirement.',
        id === 'I4' ? 'if actual != predicted:\n  squash_younger(I4); PC = 0x200' : 'ROB[id].result = execute(id); wake_dependents(id)')
    }
    for (let index = 0; index < 4; index += 1) {
      const id = model.retireNext()!
      trace.record(model.snapshot(id), `Retire ${id}`, 'Only the oldest completed, unsquashed operation can commit its architectural effects.', 'commit(ROB.head); advance_head()')
    }
    trace.record(model.snapshot('I5'), 'Wrong-path result discarded', 'Committed r1 = 10, r2 = 7, r3 = 11. I5 computed 99 but was squashed; r2 never becomes 99.', 'r1 = 10; r2 = 7; r3 = 11\nI5.state = squashed', 2)
  }
}
