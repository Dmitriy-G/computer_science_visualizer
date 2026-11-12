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
}

export class OutOfOrderLayout {
  public static create(state: OutOfOrderDiagramState): HardwareDiagram {
    const diagram = CpuCoreLayout.create(['instruction-cache', 'instruction-scheduler', 'integer-alus', 'register-files', 'reorder-retirement', 'instruction-fetch', 'load-store', 'data-cache', 'address-generation'])
    CpuCoreLayout.fixture(diagram, 'instruction-cache', 'instruction-cache', 'resident instruction stream', 'I1 I2 I3 I4 I5')
    CpuCoreLayout.fixture(diagram, 'instruction-scheduler', 'scheduler', 'ready work / dependency wait', state.flow === 'wait' ? state.unit : state.id)
    CpuCoreLayout.fixture(diagram, 'integer-alus', 'execution-unit', 'current execution', state.flow === 'wait' || state.flow.startsWith('load-') ? 'idle' : state.unit)
    CpuCoreLayout.fixture(diagram, 'register-files', 'committed-registers', 'architectural register values', state.registers, 0, 0, 1, 560)
    CpuCoreLayout.fixture(diagram, 'address-generation', 'memory-address', 'load address', 'A')
    CpuCoreLayout.fixture(diagram, 'load-store', 'load-store-unit', 'load [A]', state.loadPending ? 'pending' : 'complete')
    CpuCoreLayout.fixture(diagram, 'data-cache', 'data-cache', 'teaching load value', 'A = 10')
    for (let index = 0; index < 5; index += 1) CpuCoreLayout.place(diagram, 'reorder-retirement', `I${index + 1}`, index % 3, Math.floor(index / 3), 3, 190)
    CpuCoreLayout.fixture(diagram, 'reorder-retirement', 'retirement-head', 'oldest unretired instruction', state.flow === 'retire-wait' ? `${state.head}: waiting` : state.head, 0, 2, 1, 350)
    CpuCoreLayout.place(diagram, 'instruction-fetch', 'pc')
    const executing = state.flow === 'execute' || state.flow === 'redirect'
    for (let index = 1; index < 4; index += 1) diagram.connect(`order-${index}`, `I${index}`, `I${index + 1}`, 'program order')
    if (state.producer) diagram.connect('dependency', state.producer, 'scheduler', 'true dependency', executing, -80, `Data: ${state.producer} supplies operand ${state.operand} to ${state.id}`)
    diagram.connect('issue', state.id, 'scheduler', 'issue ready work', executing, 75, `Instruction: ${state.id}, ${state.instruction}`)
    diagram.connect('execute', 'scheduler', 'execution-unit', 'execute instruction', executing, -140, `Data: ${state.id} uses operand ${state.operand}${state.branch ? ' to resolve its condition' : ` and addend ${state.addend}`}`)
    diagram.connect('complete', 'execution-unit', state.id, 'speculative result', executing, 55, `Data: ${state.id} result = ${state.result}; not yet committed`)
    diagram.connect('order-4', 'I4', 'I5', state.flow === 'redirect' ? 'squash' : 'program order', state.flow === 'redirect', 40, 'Control: discard younger wrong-path instruction I5 and its result 99')
    diagram.connect('redirect', 'I4', 'pc', 'redirect fetch', state.flow === 'redirect', -170, 'Control: branch is taken; restart instruction fetch at 0x200')
    diagram.connect('load-request', 'I1', 'load-store-unit', 'load request', state.flow === 'load-request', -70, 'Request: I1 loads the value at address A')
    diagram.connect('address', 'load-store-unit', 'memory-address', 'calculate address', state.flow === 'load-request', 70, 'Data: effective load address = A')
    diagram.connect('data-request', 'memory-address', 'data-cache', 'read data cache', state.flow === 'load-request', 0, 'Request: read address A through the data-cache path')
    diagram.connect('load-response', 'data-cache', 'load-store-unit', 'load data = 10', state.flow === 'load-response', 80, 'Data: address A returns 10')
    diagram.connect('load-result', 'load-store-unit', 'I1', 'deliver load result', state.flow === 'load-response', 70, 'Data: I1 receives 10 and wakes its dependents')
    diagram.connect('commit', state.id, state.branch ? 'retirement-head' : 'committed-registers', state.branch ? 'retire branch' : 'commit result', state.flow === 'retire', 100, state.branch ? `Control: retire resolved branch ${state.id}` : `Data: commit ${state.id}'s result ${state.result} to architectural registers`)
    diagram.connect('head', state.id, 'retirement-head', 'advance head', state.flow === 'retire', -45, `Control: next retirement head = ${state.head}`)
    return CpuCoreLayout.route(diagram)
  }
}
