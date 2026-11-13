import type { HardwareDiagram } from '../../../../../visualization/HardwareDiagram.ts'
import { CpuCoreLayout } from '../CpuCore/CpuCoreLayout.ts'

export interface OutOfOrderDiagramState {
  readonly flow: string
  readonly id: string
  readonly instruction: string
  readonly unit: string
  readonly registers: string
  readonly head: string
  readonly loadPending: boolean
  readonly producer: string | null
  readonly operand: number
  readonly addend: number
  readonly result: number | null
  readonly branch: boolean
  readonly mapping: string
  readonly destination: string | null
  readonly physicalDestination: number | null
  readonly physicalSource: number | null
  readonly previousPhysical: number | null
}

export class OutOfOrderLayout {
  public static create(state: OutOfOrderDiagramState): HardwareDiagram {
    const diagram = CpuCoreLayout.create(['instruction-cache', 'rename-map', 'dispatch-allocation', 'instruction-scheduler', 'integer-alus', 'register-files', 'architectural-state', 'reorder-retirement', 'instruction-fetch', 'load-store', 'data-cache', 'address-generation'])
    CpuCoreLayout.fixture(diagram, 'instruction-cache', 'instruction-cache', 'resident instruction stream', 'I1 I2 I3 I4 I5')
    CpuCoreLayout.fixture(diagram, 'instruction-scheduler', 'scheduler', 'ready work / dependency wait', state.flow === 'wait' ? state.unit : state.id)
    CpuCoreLayout.fixture(diagram, 'rename-map', 'rename-map', 'speculative architectural to physical map', state.mapping, 0, 0, 1, 450)
    CpuCoreLayout.fixture(diagram, 'dispatch-allocation', 'dispatch', 'program-order ROB / queue allocation', 'I1 I2 I3 I4 I5')
    CpuCoreLayout.fixture(diagram, 'integer-alus', 'execution-unit', 'current execution', state.flow === 'execute' || state.flow === 'redirect' ? state.unit : 'idle')
    for (let index = 0; index < 7; index += 1) CpuCoreLayout.place(diagram, 'register-files', `physical-${index}`, index % 4, Math.floor(index / 4), 4, 210)
    CpuCoreLayout.fixture(diagram, 'architectural-state', 'committed-registers', 'committed mappings / values remain in PRF', state.registers, 0, 0, 1, 700)
    CpuCoreLayout.fixture(diagram, 'address-generation', 'memory-address', 'load address', 'A')
    CpuCoreLayout.fixture(diagram, 'load-store', 'load-store-unit', 'load [A]', state.loadPending ? 'pending' : 'complete')
    CpuCoreLayout.fixture(diagram, 'data-cache', 'data-cache', 'teaching load value', 'A = 10')
    for (let index = 0; index < 5; index += 1) CpuCoreLayout.place(diagram, 'reorder-retirement', `I${index + 1}`, index % 3, Math.floor(index / 3), 3, 190)
    CpuCoreLayout.fixture(diagram, 'reorder-retirement', 'retirement-head', 'oldest unretired instruction', state.flow === 'retire-wait' ? `${state.head}: waiting` : state.head, 2, 1, 3, 250)
    CpuCoreLayout.place(diagram, 'instruction-fetch', 'pc')
    const executing = state.flow === 'execute' || state.flow === 'redirect'
    for (let index = 1; index < 4; index += 1) diagram.connect(`order-${index}`, `I${index}`, `I${index + 1}`, 'program order')
    if (state.producer && state.physicalSource !== null) diagram.connect('dependency', `physical-${state.physicalSource}`, 'scheduler', 'true dependency ready', executing, -80, `Data: ${state.producer} supplies p${state.physicalSource} = ${state.operand} to ${state.id}`)
    diagram.connect('issue', 'scheduler', 'execution-unit', 'issue ready work', executing, -140, `Instruction: ${state.id}, ${state.instruction}`)
    diagram.connect('execute', state.physicalSource === null ? 'scheduler' : `physical-${state.physicalSource}`, 'execution-unit', 'read operands / execute', executing, -100, `Data: ${state.id} uses operand ${state.operand}${state.branch ? ' to resolve its condition' : ` and addend ${state.addend}`}`)
    diagram.connect('complete', 'execution-unit', state.physicalDestination === null ? state.id : `physical-${state.physicalDestination}`, state.branch ? 'branch completion' : 'write back speculative result', executing, 55, state.branch ? `Control: ${state.id} resolves taken = ${state.result}` : `Data: ${state.id} writes p${state.physicalDestination} = ${state.result}; not yet committed`)
    if (state.physicalDestination !== null) diagram.connect('writeback-complete', `physical-${state.physicalDestination}`, state.id, 'mark ROB entry complete', executing, 55, `Control: ${state.id} has written back to p${state.physicalDestination}`)
    diagram.connect('order-4', 'I4', 'I5', state.flow === 'redirect' ? 'squash' : 'program order', state.flow === 'redirect', 40, 'Control: discard younger wrong-path instruction I5 and its result 99')
    diagram.connect('redirect', 'I4', 'pc', 'redirect fetch', state.flow === 'redirect', -170, 'Control: branch is taken; restart instruction fetch at 0x200')
    diagram.connect('recover-map', 'I4', 'rename-map', 'restore surviving mappings', state.flow === 'redirect', 120, 'Control: restore r2 -> p4; discard the wrong-path r2 -> p6 mapping')
    diagram.connect('squash-register', 'I5', 'physical-6', 'release wrong-path destination', state.flow === 'redirect', 80, 'Control: discard speculative value 99 and release p6')
    diagram.connect('load-request', 'scheduler', 'load-store-unit', 'issue load request', state.flow === 'load-request', -70, 'Request: issue I1 to load the value at symbolic address A')
    diagram.connect('address', 'load-store-unit', 'memory-address', 'calculate address', state.flow === 'load-request', 70, 'Data: effective load address = A')
    diagram.connect('data-request', 'memory-address', 'data-cache', 'read data cache', state.flow === 'load-request', 0, 'Request: read address A through the data-cache path')
    diagram.connect('load-response', 'data-cache', 'load-store-unit', 'load data = 10', state.flow === 'load-response', 80, 'Data: address A returns 10')
    diagram.connect('load-result', 'load-store-unit', 'physical-3', 'write back load result', state.flow === 'load-response', 70, 'Data: I1 writes p3 = 10 and wakes its dependents')
    diagram.connect('load-complete', 'physical-3', 'I1', 'mark load complete', state.flow === 'load-response', 70, 'Control: I1 has written back to p3')
    diagram.connect('commit', state.id, state.branch ? 'retirement-head' : 'committed-registers', state.branch ? 'retire branch' : 'commit destination mapping', state.flow === 'retire', 100, state.branch ? `Control: retire resolved branch ${state.id}` : `Control: commit ${state.destination} -> p${state.physicalDestination}; value ${state.result} stays in the PRF`)
    if (state.previousPhysical !== null) diagram.connect('reclaim', 'committed-registers', `physical-${state.previousPhysical}`, 'release superseded register', state.flow === 'retire', 80, `Control: release superseded physical register p${state.previousPhysical}`)
    diagram.connect('head', state.id, 'retirement-head', 'advance head', state.flow === 'retire', -45, `Control: next retirement head = ${state.head}`)
    return CpuCoreLayout.route(diagram)
  }
}
