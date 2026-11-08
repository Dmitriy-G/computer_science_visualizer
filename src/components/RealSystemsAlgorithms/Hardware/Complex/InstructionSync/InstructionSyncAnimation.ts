import { HardwareInformation, HardwareLesson } from '../HardwareLesson.ts'
import type { HardwareTrace } from '../HardwareLesson.ts'
import { InstructionSyncModel } from './InstructionSyncModel.ts'

export class InstructionSyncAnimation extends HardwareLesson {
  public readonly title = 'Instruction-cache synchronization and ISB'
  public static describe() {
    return HardwareInformation.create('Instruction-cache synchronization and ISB',
      'Writing new instruction bytes through the data side does not ensure instruction fetch sees them. Clean, synchronize, invalidate, and synchronize the executing core\'s instruction stream.',
      'Arm AArch64', 'https://community.arm.com/arm-community-blogs/b/architectures-and-processors-blog/posts/caches-self-modifying-code-working-with-threads',
      'Arm describes the DC CVAU, DSB, IC IVAU, DSB, ISB sequence and the need for synchronization on other executing cores.',
      'One conceptual cache line, two cooperating cores, Inner Shareable code. Both data and instruction maintenance are required in this configuration; IDC/DIC and other features can change requirements. No writable/executable mapping API, line-size loop, or safe concurrent patching protocol is implemented. ISB is local, not broadcast.')
  }
  protected build(trace: HardwareTrace): void {
    const model = new InstructionSyncModel()
    trace.record(model.snapshot(), 'Old code is already fetched', 'Both cores have the old MOV w0,#1 instruction in their fetched streams. They cooperate to stop entering the code during modification.', '// quiesce code execution\nold instruction: MOV w0,#1', 0)
    model.write()
    trace.record(model.snapshot(), 'Write new instruction bytes', 'The data cache now contains MOV w0,#2. Instruction caches and already-fetched streams can still hold the old instruction.', 'STR new_instruction,[code]')
    model.dcCvau()
    trace.record(model.snapshot(), 'Clean to Point of Unification', 'DC CVAU initiates the data-side clean. It has not completed yet.', 'DC CVAU,code')
    model.dsb()
    trace.record(model.snapshot(), 'Complete the data clean', 'DSB ISH completes the relevant data maintenance before instruction invalidation.', 'DSB ISH')
    model.icIvau()
    trace.record(model.snapshot(), 'Invalidate instruction-cache copies', 'IC IVAU initiates instruction-side invalidation in the required scope.', 'IC IVAU,code')
    model.dsb()
    trace.record(model.snapshot(), 'Complete instruction invalidation', 'Cached instructions are invalid, but both cores can still have already-fetched old instructions. Cache invalidation alone does not synchronize those streams.', 'DSB ISH')
    model.isb(0)
    trace.record(model.snapshot(), 'ISB synchronizes core 0 only', 'Core 0 must refetch. Core 1 still has its old fetched stream; ISB is not broadcast.', 'C0: ISB')
    const result = model.execute(0)
    trace.record(model.snapshot(), 'Core 0 observes the new instruction', `Refetch through the synchronized path executes MOV w0,#${result}. Core 1 remains quiesced until its own synchronization.`, 'C0: fetch new code -> w0=2')
    model.isb(1)
    trace.record(model.snapshot(), 'Core 1 executes its own ISB', 'The local synchronization arrow affects core 1\'s fetched stream. Core 0\'s earlier ISB did not do this work for core 1.', 'notify C1 after maintenance\nC1: ISB')
    model.execute(1)
    trace.record(model.snapshot(), 'Cooperating core synchronizes too', 'After notification and its own ISB, core 1 also refetches the new instruction. A real threaded protocol must coordinate entry to modified code.', 'notify C1 after maintenance\nC1: ISB; enter code -> w0=2', 2)
  }
}
