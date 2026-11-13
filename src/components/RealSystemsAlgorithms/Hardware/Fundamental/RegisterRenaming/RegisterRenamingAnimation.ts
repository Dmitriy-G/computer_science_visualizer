import { CpuLesson, CpuLessonInformation } from '../CpuLesson.ts'
import type { CpuTrace } from '../CpuTrace.ts'
import { RegisterRenameModel } from './RegisterRenameModel.ts'

export class RegisterRenamingAnimation extends CpuLesson {
  public readonly title = 'Register renaming'

  public static describe() {
    return CpuLessonInformation.create('Register renaming',
      'Reusing a register name creates false dependencies that restrict parallel execution. Give separate writes different physical destinations while preserving true data dependencies.',
      'Intel Core', 'https://cdrdv2-public.intel.com/814198/248966-Optimization-Reference-Manual-V1-049.pdf',
      'Intel documents physical-register renaming in its processor architecture descriptions.',
      'The lesson uses a PRF with three architectural names, seven physical registers, a speculative rename map, and committed mappings. Committed values remain in the PRF. Register counts, instruction selection, and event ordering are illustrative.')
  }

  protected build(trace: CpuTrace): void {
    const model = new RegisterRenameModel()
    trace.record(model.snapshot(), 'Architectural names', 'r1 starts at 3. I1 and I3 both write r1, while I2 must use I1’s value.', 'r1 = 3; r2 = 4; r3 = 0', 0)
    for (let index = 0; index < RegisterRenameModel.program.length; index += 1) {
      const id = model.renameNext()
      trace.record(model.snapshot(id), `Rename and dispatch ${id}`, 'Capture source mappings before allocating a new physical destination. Update the RAT, allocate the ROB entry, and enqueue the instruction with its captured sources.', 'sources = RAT[src]; old = RAT[dst]\nnew = allocate_physical(); RAT[dst] = new\ndispatch_to_ROB_and_issue_queue()')
    }
    for (const id of ['I3', 'I1', 'I2', 'I4']) {
      model.execute(id)
      trace.record(model.snapshot(id), `Execute ${id}`, id === 'I2' ? 'I2 reads I1’s physical value 7, even though the rename map for r1 now points to I3’s value 20.' : 'Read the captured physical operands and write only this instruction’s physical destination.', 'physical[dst] = sum(physical[sources]) + immediate')
    }
    for (let index = 0; index < RegisterRenameModel.program.length; index += 1) {
      const id = model.retireNext()
      trace.record(model.snapshot(id), `Retire ${id}`, 'Commit the oldest completed instruction by updating its committed mapping. The value stays in the PRF; release the superseded physical register.', 'committed_map[dst] = new_physical\nfree(old_physical)')
    }
    trace.explain('Final committed values: r1 = 20, r2 = 8, r3 = 28. False name dependencies were removed; I2’s true dependency on I1 was preserved.')
  }
}
