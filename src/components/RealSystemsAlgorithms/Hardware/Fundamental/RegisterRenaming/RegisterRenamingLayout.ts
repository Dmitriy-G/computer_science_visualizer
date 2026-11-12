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
}

export class RegisterRenamingLayout {
  public static create(state: RenameDiagramState): HardwareDiagram {
    const diagram = CpuCoreLayout.create(['instruction-cache', 'instruction-decoder', 'register-renaming', 'register-files', 'integer-alus', 'reorder-retirement'])
    CpuCoreLayout.fixture(diagram, 'instruction-cache', 'current-instruction', 'current program operation', `${state.id}: ${state.text}`)
    CpuCoreLayout.fixture(diagram, 'instruction-decoder', 'decoded-instruction', 'decoded operation', `${state.id}: ${state.text}`)
    CpuCoreLayout.fixture(diagram, 'register-renaming', 'rename-map', 'architectural to physical names', state.mapping)
    for (let index = 0; index < 7; index += 1) CpuCoreLayout.place(diagram, 'register-files', `physical-${index}`, index % 4, Math.floor(index / 4), 4, 130)
    CpuCoreLayout.fixture(diagram, 'register-files', 'committed-registers', 'committed architectural registers', state.committed, 0, 2, 1, 560)
    CpuCoreLayout.fixture(diagram, 'integer-alus', 'alu', 'current operation / result', state.result)
    for (let index = 0; index < 4; index += 1) CpuCoreLayout.place(diagram, 'reorder-retirement', `I${index + 1}`, index % 2, Math.floor(index / 2), 2, 270)
    CpuCoreLayout.fixture(diagram, 'reorder-retirement', 'retirement', 'in-order retirement control', state.phase === 'retire' ? state.id : 'waiting to retire', 0, 2, 1, 350)

    diagram.connect('instruction-decode', 'current-instruction', 'decoded-instruction', 'decode instruction', state.phase === 'rename', 0, `Instruction: ${state.id}, ${state.text}`)
    diagram.connect('decode', 'decoded-instruction', 'rename-map', 'rename names', state.phase === 'rename', 45, `Control: capture sources and rename ${state.destinationName} for ${state.id}`)
    diagram.connect('map-destination', 'rename-map', `physical-${state.destination}`, 'allocate destination', state.phase === 'rename', 40, `Control: allocate p${state.destination} as ${state.id}'s destination`)
    if (state.sources.length) {
      for (let index = 0; index < state.sources.length; index += 1) {
        const source = state.sources[index]
        diagram.connect(`operand-${source}`, `physical-${source}`, 'alu', 'read true operand', state.phase === 'execute', -90, `Data: ${state.id} reads p${source} = ${state.operands[index]}`)
      }
    } else diagram.connect('immediate', 'decoded-instruction', 'alu', 'immediate operand', state.phase === 'execute', -120, `Data: ${state.id} uses immediate ${state.immediate}`)
    diagram.connect('result', 'alu', `physical-${state.destination}`, 'write result', state.phase === 'execute', 110, `Data: ${state.id} writes p${state.destination} = ${state.value}`)
    diagram.connect('retire', `physical-${state.destination}`, 'retirement', 'ready to retire', state.phase === 'retire', 75, `Data: ${state.id}'s completed result = ${state.value}`)
    diagram.connect('commit', 'retirement', 'committed-registers', 'commit register', state.phase === 'retire', -90, `Data: commit ${state.destinationName} = ${state.value} in program order`)
    diagram.connect('reclaim', 'committed-registers', `physical-${state.previous}`, 'release old register', state.phase === 'retire', 80, `Control: release superseded physical register p${state.previous}`)
    diagram.connect('retired-state', 'retirement', state.id, 'mark retired', state.phase === 'retire', 35, `Control: mark ${state.id} retired`)
    return CpuCoreLayout.route(diagram)
  }
}
