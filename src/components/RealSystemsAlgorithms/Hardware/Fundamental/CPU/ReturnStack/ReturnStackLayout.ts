import { HardwareDiagram } from '../../../../../../visualization/HardwareDiagram.ts'

export interface ReturnDiagramState {
  readonly flow: string
  readonly slot: number
  readonly register: string
  readonly predicted: string
  readonly actual: string
  readonly matched: number
  readonly returns: number
  readonly lost: number
  readonly underflows: number
}

export class ReturnStackLayout {
  public static create(state: ReturnDiagramState): HardwareDiagram {
    const diagram = new HardwareDiagram(960, 760)
    diagram.region('core', 'CPU / Core 0', 'cpu', 10, 10, 940, 730, 'system')
    diagram.region('icache-region', 'Instruction cache / program', 'cache', 20, 50, 260, 170)
    diagram.region('register-region', 'Core / return registers', 'cpu', 350, 50, 260, 170)
    diagram.region('prediction-region', 'Core / return prediction', 'cpu', 680, 50, 260, 170)
    diagram.region('depth-region', 'Program call-depth reference', 'cpu', 20, 250, 260, 170)
    diagram.region('actual-region', 'Core / resolved return target', 'cpu', 350, 250, 260, 170)
    diagram.region('fetch-region', 'Core / next-fetch selector', 'cpu', 680, 250, 260, 170)
    diagram.region('stack-region', 'Hardware return predictor / 8 entries', 'cpu', 20, 450, 590, 285)
    diagram.region('dcache-region', 'Data cache / context', 'cache', 680, 450, 260, 135)
    diagram.region('statistics-region', 'Prediction accounting', 'cpu', 680, 590, 260, 150)
    diagram.fixture('instruction-cache', 'recognized program instruction', state.flow === 'call' ? 'CALL / BL' : state.flow.startsWith('return-') ? 'RET' : 'no call yet', 150, 150, 'resident program / schematic')
    diagram.fixture('return-register', 'program-supplied return address', state.register, 480, 150, 'saved/restored by program')
    diagram.place('predicted', 810, 150).place('depth', 150, 350).place('actual', 480, 350)
    const nextFetch = state.flow === 'return-predict' ? state.predicted === 'unavailable' ? 'await actual target' : state.predicted : state.flow === 'return-resolve' ? state.actual : state.flow === 'call' ? 'call continues' : 'not selected'
    diagram.fixture('next-fetch', 'next program fetch', nextFetch, 810, 350)
    for (let index = 0; index < 8; index += 1) diagram.place(`return-${index}`, 95 + index % 4 * 150, 550 + Math.floor(index / 4) * 130, 110)
    diagram.fixture('data-cache', 'program data / not simulated', 'cache context', 810, 530)
    diagram.fixture('statistics', 'matching returns', `${state.matched} / ${state.returns}`, 810, 685, `overflow ${state.lost}; empty ${state.underflows}`)
    const slot = `return-${Math.max(0, state.slot)}`
    diagram.connect('call-address', 'instruction-cache', 'return-register', 'call return address', state.flow === 'call')
    diagram.connect('push', 'return-register', slot, 'push prediction', state.flow === 'call', 30)
    diagram.connect('pop', slot, 'predicted', state.slot < 0 ? 'stack empty' : 'pop prediction', state.flow === 'return-predict' && state.slot >= 0, -55)
    diagram.connect('predict-fetch', 'predicted', 'next-fetch', 'predict next fetch', state.flow === 'return-predict' && state.predicted !== 'unavailable', 35)
    diagram.connect('resolve', 'return-register', 'actual', 'resolve actual target', state.flow === 'return-resolve', 35)
    diagram.connect('validate', 'actual', 'next-fetch', state.predicted === state.actual ? 'confirm target' : 'use actual target', state.flow === 'return-resolve')
    return diagram
  }
}
