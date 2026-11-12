import type { HardwareDiagram } from '../../../../../visualization/HardwareDiagram.ts'
import { CpuCoreLayout } from '../CpuCore/CpuCoreLayout.ts'

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
    const diagram = CpuCoreLayout.create(['instruction-cache', 'instruction-decoder', 'register-files', 'branch-predictor', 'integer-alus', 'instruction-fetch'])
    const instruction = state.flow === 'call' ? 'CALL / BL' : state.flow.startsWith('return-') ? 'RET' : 'no call yet'
    CpuCoreLayout.fixture(diagram, 'instruction-cache', 'instruction-cache', 'recognized program instruction', instruction)
    CpuCoreLayout.fixture(diagram, 'instruction-decoder', 'decoded-instruction', 'call / return recognition', instruction)
    CpuCoreLayout.fixture(diagram, 'register-files', 'return-register', 'program-supplied return address', state.register, 0, 0, 1, 350)
    CpuCoreLayout.place(diagram, 'branch-predictor', 'predicted', 0, 0, 2, 280)
    CpuCoreLayout.fixture(diagram, 'branch-predictor', 'statistics', 'matches; overflow; empty returns', `${state.matched}/${state.returns}; lost ${state.lost}; empty ${state.underflows}`, 1, 0, 2, 300)
    for (let index = 0; index < 8; index += 1) CpuCoreLayout.place(diagram, 'branch-predictor', `return-${index}`, index % 4, 1 + Math.floor(index / 4), 4, 130)
    CpuCoreLayout.place(diagram, 'integer-alus', 'actual')
    const nextFetch = state.flow === 'return-predict' ? state.predicted === 'unavailable' ? 'wait for target' : state.predicted : state.flow === 'return-resolve' ? state.actual : state.flow === 'call' ? 'call continues' : 'pending'
    CpuCoreLayout.fixture(diagram, 'instruction-fetch', 'next-fetch', 'next program fetch', nextFetch)
    const slot = `return-${Math.max(0, state.slot)}`
    diagram.connect('call-decode', 'instruction-cache', 'decoded-instruction', 'recognize call', state.flow === 'call', 0, 'Instruction: recognize CALL / BL and its return address')
    diagram.connect('call-address', 'decoded-instruction', 'return-register', 'call return address', state.flow === 'call', 90, `Data: program return address = ${state.register}`)
    diagram.connect('push', 'return-register', slot, 'push prediction', state.flow === 'call', -100, `Data: push return address ${state.register} into predictor slot ${state.slot}`)
    diagram.connect('fetch-return', 'instruction-cache', 'decoded-instruction', 'recognize return', state.flow === 'return-predict', 0, 'Instruction: recognize RET before predicting its target')
    diagram.connect('pop', slot, 'predicted', state.slot < 0 ? 'stack empty' : 'pop prediction', state.flow === 'return-predict' && state.slot >= 0, -35, `Data: pop predicted return address ${state.predicted} from slot ${state.slot}`)
    diagram.connect('predict-fetch', 'predicted', 'next-fetch', 'predict next fetch', state.flow === 'return-predict' && state.predicted !== 'unavailable', -80, `Control: predict the next fetch address ${state.predicted}`)
    diagram.connect('resolve', 'return-register', 'actual', 'resolve actual target', state.flow === 'return-resolve', -180, `Data: actual program return address = ${state.register}`)
    diagram.connect('validate', 'actual', 'next-fetch', state.predicted === state.actual ? 'confirm target' : 'use actual target', state.flow === 'return-resolve', -160, `Control: ${state.predicted === state.actual ? 'confirm' : 'recover fetch using'} actual target ${state.actual}`)
    return CpuCoreLayout.route(diagram)
  }
}
