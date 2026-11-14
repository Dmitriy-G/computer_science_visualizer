import type { ActionDefinition, ActionPlan } from '../../../../../visualization/ActionDefinition.ts'
import type { HardwareSnapshot } from '../HardwareSnapshot.ts'
import { CpuOperationModel } from './CpuOperationModel.ts'
import type { CpuOperationKind } from './CpuOperationModel.ts'
import { CpuOperationTrace } from './CpuOperationTrace.ts'

export abstract class CpuOperationAnimation implements ActionDefinition<HardwareSnapshot> {
  public abstract readonly title: string
  protected abstract readonly operation: CpuOperationKind

  public create(_source: HardwareSnapshot): ActionPlan<HardwareSnapshot> {
    const model = new CpuOperationModel(this.operation)
    const trace = new CpuOperationTrace(model)
    trace.instruction(`LOAD r, [${model.variable}]`, '0x100')
    trace.transfer('issue', 'address', model.address, 'Calculate address', `The address-generation unit selects the aligned address of ${model.variable}.`)
    trace.transfer('address', 'translation', model.address, 'Translate address', 'Assume a valid writable normal-memory mapping and a DTLB hit. No page walk is needed.')
    trace.transfer('translation', 'memory', `${model.variable} = ${model.shared}`, 'Access L1 data cache', 'Request the translated address from the coherent cache line already present. This example does not invent a DRAM access for a cache hit.', `Request: READ ${model.address}`)
    const loaded = model.load()
    trace.transfer('memory', 'lsu', String(loaded), 'Capture one complete word', 'The aligned 32-bit load observes 7 as one indivisible memory access. Atomicity applies to this read, not to every later instruction in the expression.')
    trace.transfer('lsu', 'register', `r = ${loaded}`, 'Write loaded register', 'The loaded value reaches the private register. Subsequent writes by another core do not change this captured value.')
    trace.transfer('register', 'retirement', `LOAD ready: ${loaded}`, 'Complete load', 'The reorder buffer records completion of the load.')
    if (this.operation === 'increment') this.increment(model, trace)
    else this.load(model, trace)
    return { steps: trace.steps, result: trace.result(model) }
  }

  private increment(model: CpuOperationModel, trace: CpuOperationTrace): void {
    trace.transfer('retirement', 'committed', `r = ${model.loaded}`, 'Retire load', 'Retirement commits the loaded register state; this is control, not a value copied out of the ROB. The whole increment has not completed.', 'Control: commit LOAD')
    model.peerStore(8)
    trace.local('memory', 'i = 8', 'Another core updates i', 'Another core completes its own increment from 7 to 8 between this core\'s LOAD and STORE. Cache coherence is represented as one completed peer-store event, not a simulated protocol.', true)
    trace.instruction('ADD r, 1', '0x104')
    trace.transfer('issue', 'register', 'r = 7', 'Read captured operand', 'Request the private register containing the earlier 7, even though shared i is now 8.', 'Control: read r')
    const result = model.addOne()
    trace.transfer('register', 'alu', `7 + 1 = ${result}`, 'Add one', 'The integer ALU computes 8 from the captured register. This is not an atomic memory read-modify-write instruction.')
    trace.transfer('alu', 'register', `r = ${result}`, 'Write arithmetic result', 'Write the result into the private register; shared i remains unchanged.')
    trace.transfer('register', 'retirement', 'ADD ready: 8', 'Complete addition', 'The ADD result is ready for retirement.')
    trace.transfer('retirement', 'committed', 'r = 8', 'Retire addition', 'Commit the private register result before the following STORE; the result remains in the register file.', 'Control: commit ADD')
    trace.instruction('STORE [i], r', '0x108')
    trace.transfer('issue', 'address', model.address, 'Calculate store address', 'Select the same aligned location i for the store.')
    trace.transfer('address', 'translation', model.address, 'Translate store address', 'The mapping remains valid; store permissions are assumed.')
    trace.transfer('register', 'lsu', 'pending: 8', 'Prepare store data', 'The LSU receives the address and value 8. Preparing store data does not yet publish it.')
    trace.transfer('lsu', 'retirement', 'STORE ready: 8', 'Complete store instruction', 'The store is ready to retire. Retirement and global visibility are distinct events.')
    model.retireStore()
    trace.transfer('retirement', 'lsu', 'store buffer: 8', 'Retire store', 'Retirement permits the pending store to publish. Its data is already in the LSU, not copied from the ROB; it remains buffered until visibility is possible.', 'Control: commit STORE')
    model.publishStore()
    trace.transfer('lsu', 'memory', `i = ${model.shared}`, 'Publish store', 'The buffered store publishes 8, overwriting the other core\'s 8. Two increments produced 8 instead of 9: one update was lost.')
    model.drainStore()
    trace.local('lsu', 'empty', 'Drain store buffer', 'The store has published and the buffer entry is released.')
    trace.finish('Non-atomic increment complete', 'i = i + 1 used separate LOAD, ADD, and STORE instructions. Each word access may be atomic while their combination is not. This is a machine-level interleaving, not a valid prediction for a racy ordinary C++ int.')
  }

  private load(model: CpuOperationModel, trace: CpuOperationTrace): void {
    const local = model.retireLoad()
    trace.transfer('retirement', 'committed', `i = ${local}`, 'Retire atomic load', 'Retirement commits the register mapping/value represented as local i; this is control, not data copied from the ROB. The atomic shared operation was the single aligned word load from j, with no second shared destination store.', 'Control: commit local i')
    model.peerStore(99)
    trace.local('memory', 'j = 99', 'Another core writes afterward', 'Another core publishes 99 after this load observed 7. The local i remains 7; an atomic read need not keep tracking the source.', true)
    trace.finish('Atomic load complete', 'i = 7 and j = 99. This read captured a complete old value, never a mixture of bytes. A peer store ordered before the read could instead make the read observe 99. Atomicity does not make a shared-to-shared assignment or a whole expression indivisible.')
  }
}
