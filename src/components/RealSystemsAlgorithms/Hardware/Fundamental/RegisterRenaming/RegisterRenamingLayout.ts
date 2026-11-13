import type { HardwareDiagram } from '../../../../../visualization/HardwareDiagram.ts'
import { CpuCoreLayout } from '../CpuCore/CpuCoreLayout.ts'

export interface RenameDiagramState {
  readonly phase: string
  readonly id: string
  readonly text: string
  readonly sources: readonly number[]
  readonly operands: readonly string[]
  readonly immediate: number
  readonly destination: number
  readonly destinationName: string
  readonly previous: number
  readonly mapping: string
  readonly committed: string
  readonly result: string
  readonly value: string
  readonly free: string
}

export class RegisterRenamingLayout {
  public static create(state: RenameDiagramState): HardwareDiagram {
    const diagram = CpuCoreLayout.create(['instruction-cache', 'instruction-decoder', 'register-renaming', 'rename-map', 'dispatch-allocation', 'instruction-scheduler', 'register-files', 'architectural-state', 'integer-alus', 'reorder-retirement'])
    CpuCoreLayout.fixture(diagram, 'instruction-cache', 'current-instruction', 'current program operation', `${state.id}: ${state.text}`)
    CpuCoreLayout.fixture(diagram, 'instruction-decoder', 'decoded-instruction', 'decoded operation', `${state.id}: ${state.text}`)
    CpuCoreLayout.fixture(diagram, 'register-renaming', 'rename-stage', 'instruction', state.id, 0, 0, 2, 125)
    CpuCoreLayout.fixture(diagram, 'register-renaming', 'free-list', 'free physical IDs', state.free, 1, 0, 2, 125)
    CpuCoreLayout.fixture(diagram, 'rename-map', 'rename-map', 'speculative architectural to physical map', state.mapping, 0, 0, 1, 450)
    CpuCoreLayout.fixture(diagram, 'dispatch-allocation', 'dispatch', 'allocate ROB / issue queue entries', state.phase === 'rename' ? state.id : 'waiting')
    CpuCoreLayout.fixture(diagram, 'instruction-scheduler', 'scheduler', 'issue ready instruction', state.phase === 'execute' ? state.id : 'waiting')
    for (let index = 0; index < 7; index += 1) CpuCoreLayout.place(diagram, 'register-files', `physical-${index}`, index % 4, Math.floor(index / 4), 4, 130)
    CpuCoreLayout.fixture(diagram, 'architectural-state', 'committed-registers', 'committed mappings / values remain in PRF', state.committed, 0, 0, 1, 700)
    CpuCoreLayout.fixture(diagram, 'integer-alus', 'alu', 'current operation / result', state.result)
    for (let index = 0; index < 4; index += 1) CpuCoreLayout.place(diagram, 'reorder-retirement', `I${index + 1}`, index % 2, Math.floor(index / 2), 3, 270)
    CpuCoreLayout.fixture(diagram, 'reorder-retirement', 'retirement', 'in-order retirement control', state.phase === 'retire' ? state.id : 'waiting to retire', 2, 0, 3, 300)

    diagram.connect('instruction-decode', 'current-instruction', 'decoded-instruction', 'decode instruction', state.phase === 'rename', 0, `Instruction: ${state.id}, ${state.text}`)
    diagram.connect('decode', 'decoded-instruction', 'rename-stage', 'rename instruction', state.phase === 'rename', 45, `Instruction: ${state.id}, ${state.text}`)
    diagram.connect('map-sources', 'rename-stage', 'rename-map', 'read sources / update destination map', state.phase === 'rename', 0, `Control: capture sources and map ${state.destinationName} to p${state.destination} for ${state.id}`)
    diagram.connect('map-destination', 'free-list', `physical-${state.destination}`, 'allocate physical destination', state.phase === 'rename', 40, `Control: allocate p${state.destination} as ${state.id}'s destination`)
    diagram.connect('dispatch', 'rename-map', 'dispatch', 'dispatch renamed instruction', state.phase === 'rename', 0, `Instruction: ${state.id} with captured physical sources and destination p${state.destination}`)
    diagram.connect('allocate-rob', 'dispatch', state.id, 'allocate ROB entry', state.phase === 'rename', 45, `Control: allocate ${state.id}'s ROB entry with destination p${state.destination}`)
    diagram.connect('enqueue', 'dispatch', 'scheduler', 'enqueue instruction', state.phase === 'rename', 0, `Instruction: enqueue ${state.id} with its captured physical sources`)
    diagram.connect('issue', 'scheduler', 'alu', 'issue ready instruction', state.phase === 'execute', -100, `Instruction: issue ${state.id} when its operands are ready`)
    if (state.sources.length) {
      for (let index = 0; index < state.sources.length; index += 1) {
        const source = state.sources[index]
        diagram.connect(`operand-${source}`, `physical-${source}`, 'alu', 'read true operand', state.phase === 'execute', -90, `Data: ${state.id} reads p${source} = ${state.operands[index]}`)
      }
    } else diagram.connect('immediate', 'decoded-instruction', 'alu', 'immediate operand', state.phase === 'execute', -120, `Data: ${state.id} uses immediate ${state.immediate}`)
    diagram.connect('result', 'alu', `physical-${state.destination}`, 'write result', state.phase === 'execute', 110, `Data: ${state.id} writes p${state.destination} = ${state.value}`)
    diagram.connect('complete', `physical-${state.destination}`, state.id, 'mark ROB entry complete', state.phase === 'execute', 60, `Control: ${state.id} has written back to p${state.destination}`)
    diagram.connect('retire', state.id, 'retirement', 'retire oldest completed instruction', state.phase === 'retire', 75, `Control: ${state.id} is complete and next in program order`)
    diagram.connect('commit', 'retirement', 'committed-registers', 'commit destination mapping', state.phase === 'retire', -90, `Control: commit ${state.destinationName} -> p${state.destination}; value ${state.value} stays in the PRF`)
    diagram.connect('reclaim', 'committed-registers', `physical-${state.previous}`, 'release old register', state.phase === 'retire', 80, `Control: release superseded physical register p${state.previous}`)
    diagram.connect('retired-state', 'retirement', state.id, 'mark retired', state.phase === 'retire', 35, `Control: mark ${state.id} retired`)
    return CpuCoreLayout.route(diagram)
  }
}
