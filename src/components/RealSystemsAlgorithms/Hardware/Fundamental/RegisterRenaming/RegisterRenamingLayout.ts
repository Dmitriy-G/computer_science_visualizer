import { HardwareDiagram } from '../../../../../visualization/HardwareDiagram.ts'

export interface RenameDiagramState {
  readonly phase: string
  readonly id: string
  readonly text: string
  readonly sources: readonly number[]
  readonly destination: number
  readonly previous: number
  readonly mapping: string
  readonly committed: string
  readonly result: string
}

export class RegisterRenamingLayout {
  public static create(state: RenameDiagramState): HardwareDiagram {
    const diagram = new HardwareDiagram(960, 740)
    diagram.region('core', 'CPU / Core 0', 'cpu', 10, 10, 940, 710, 'system')
    diagram.region('icache-region', 'Instruction cache / program', 'cache', 20, 60, 260, 170)
    diagram.region('rename-region', 'Core / register rename unit', 'cpu', 350, 60, 260, 170)
    diagram.region('dcache-region', 'Data cache / context', 'cache', 680, 60, 260, 170)
    diagram.region('physical-region', 'Core / physical register file', 'cpu', 20, 300, 590, 290)
    diagram.region('alu-region', 'Core / execution unit', 'cpu', 680, 300, 260, 170)
    diagram.region('architectural-region', 'Core / retirement + registers', 'cpu', 680, 515, 260, 180)
    diagram.fixture('current-instruction', 'current program operation', `${state.id}: ${state.text}`, 150, 160, 'resident program / schematic', 230)
    diagram.fixture('rename-map', 'architectural to physical names', state.mapping, 480, 160, undefined, 230)
    diagram.fixture('data-cache', 'no data-memory operation here', 'idle', 810, 160)
    for (let index = 0; index < 7; index += 1) diagram.place(`physical-${index}`, 95 + index % 4 * 150, 400 + Math.floor(index / 4) * 130, 110)
    diagram.fixture('alu', 'current operation / result', state.result, 810, 400)
    diagram.fixture('committed-registers', 'architectural register values', state.committed, 810, 620, undefined, 230)
    diagram.connect('decode', 'current-instruction', 'rename-map', 'rename names', state.phase === 'rename')
    diagram.connect('map-destination', 'rename-map', `physical-${state.destination}`, 'allocate destination', state.phase === 'rename', 40)
    if (state.sources.length) {
      for (const source of state.sources) diagram.connect(`operand-${source}`, `physical-${source}`, 'alu', 'read true operand', state.phase === 'execute', -40)
    } else diagram.connect('immediate', 'current-instruction', 'alu', 'immediate operand', state.phase === 'execute', -50)
    diagram.connect('result', 'alu', `physical-${state.destination}`, 'write result', state.phase === 'execute', -40)
    diagram.connect('retire', `physical-${state.destination}`, 'committed-registers', 'retire in order', state.phase === 'retire', 45)
    if (state.phase === 'retire') diagram.connect('reclaim', 'committed-registers', `physical-${state.previous}`, 'release old register', true, -65)
    return diagram
  }
}
