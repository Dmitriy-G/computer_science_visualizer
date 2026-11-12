import type { HardwareDiagram } from '../../../../../visualization/HardwareDiagram.ts'
import { CpuCoreLayout } from '../CpuCore/CpuCoreLayout.ts'

export interface BranchDiagramState {
  readonly flow: string
  readonly index: number
  readonly predicted: boolean | null
  readonly actual: boolean | null
  readonly correct: number
  readonly resolved: number
  readonly counter: number
  readonly history: string
  readonly pc: string
}

export class BranchPredictionLayout {
  public static create(state: BranchDiagramState): HardwareDiagram {
    const diagram = CpuCoreLayout.create(['instruction-fetch', 'instruction-cache', 'branch-predictor', 'integer-alus'])
    CpuCoreLayout.place(diagram, 'instruction-fetch', 'branch-pc', 0, 0, 2, 85)
    const direction = state.actual ?? state.predicted
    CpuCoreLayout.fixture(diagram, 'instruction-fetch', 'next-fetch', 'next path', direction === null ? 'pending' : direction ? 'taken' : 'fallthrough', 1, 0, 2, 95)
    CpuCoreLayout.fixture(diagram, 'instruction-cache', 'instruction-cache', 'program instruction', 'conditional branch')
    CpuCoreLayout.place(diagram, 'branch-predictor', 'history', 0, 0, 3, 180)
    CpuCoreLayout.place(diagram, 'branch-predictor', 'predicted', 1, 0, 3, 180)
    CpuCoreLayout.fixture(diagram, 'branch-predictor', 'statistics', 'correct / resolved predictions', `${state.correct} / ${state.resolved}`, 2, 0, 3, 180)
    for (let index = 0; index < 8; index += 1) CpuCoreLayout.place(diagram, 'branch-predictor', `counter-${index}`, index % 4, 1 + Math.floor(index / 4), 4, 130)
    CpuCoreLayout.place(diagram, 'integer-alus', 'actual')
    const predicted = state.predicted ? 'taken' : 'not taken'
    const actual = state.actual ? 'taken' : 'not taken'
    diagram.connect('fetch', 'branch-pc', 'instruction-cache', 'fetch branch', state.flow === 'predict', 0, `Request: fetch the branch at PC ${state.pc}`)
    diagram.connect('select', 'history', `counter-${state.index}`, 'index by history', state.flow === 'predict', -35, `Control: history ${state.index.toString(2).padStart(3, '0')} selects PHT[${state.index}]`)
    diagram.connect('predict', `counter-${state.index}`, 'predicted', 'counter decision', state.flow === 'predict', 40, `Data: PHT[${state.index}] = ${state.counter}; predict ${predicted}`)
    diagram.connect('steer', 'predicted', 'next-fetch', 'steer next fetch', state.flow === 'predict', -70, `Control: follow the predicted ${predicted} path`)
    diagram.connect('execute', 'instruction-cache', 'actual', 'resolve branch', state.flow === 'resolve', -160, `Data: executed branch resolves ${actual}`)
    diagram.connect('train', 'actual', `counter-${state.index}`, 'train selected entry', state.flow === 'resolve', 120, `Data: outcome ${actual}; train PHT[${state.index}] to ${state.counter}`)
    diagram.connect('history-update', 'actual', 'history', 'shift actual outcome', state.flow === 'resolve', -110, `Data: shift outcome bit ${Number(state.actual)} into history; history = ${state.history}`)
    diagram.connect('redirect', 'actual', 'next-fetch', state.actual !== state.predicted ? 'redirect fetch' : 'confirm prediction', state.flow === 'resolve', -200, `Control: ${state.actual !== state.predicted ? 'redirect fetch to' : 'confirm'} the ${actual} path`)
    return CpuCoreLayout.route(diagram)
  }
}
