import { AhoCorasickAutomaton } from './AhoCorasickAutomaton.ts'
import { LinearScene } from '../../../../visualization/LinearScene.ts'
import { StringTextScene } from '../../../../visualization/StringTextScene.ts'
import type { LinearFrame, LinearModel } from '../../../../visualization/LinearModel.ts'
import type { Scene, SceneEdge } from '../../../../visualization/Scene.ts'

export class AhoCorasickAutomatonLayout {
  public create(source: LinearModel, frame: LinearFrame = {}): Scene {
    const model = source as AhoCorasickAutomaton
    const states = model.getStates()
    const patterns = model.getPatterns()
    const nodes = StringTextScene.ranked(states.map((state) => ({ id: state.id, text: state.id === 'ac-root' ? 'root' : state.id,
      label: state.pattern === null ? `depth ${state.depth}` : `pattern ${patterns[state.pattern]}`, rank: state.depth })))
    const edges: SceneEdge[] = []
    for (const state of states) {
      for (const [character, target] of state.transitions) edges.push(LinearScene.edge(state.id, target, character))
      if (state.id !== 'ac-root') edges.push({ ...LinearScene.edge(state.id, state.failure, 'fail'), curveOffset: 35 })
      if (state.output) edges.push({ ...LinearScene.edge(state.id, state.output, 'output'), curveOffset: -35 })
    }
    return LinearScene.create(model, nodes, edges, frame, 'dictionary patterns')
  }
}
