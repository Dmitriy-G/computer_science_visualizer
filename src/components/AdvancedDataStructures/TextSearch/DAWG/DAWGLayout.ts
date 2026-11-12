import { DAWG } from './DAWG.ts'
import { LinearScene } from '../../../../visualization/LinearScene.ts'
import { StringTextScene } from '../../../../visualization/StringTextScene.ts'
import type { LinearFrame, LinearModel } from '../../../../visualization/LinearModel.ts'
import type { Scene, SceneEdge } from '../../../../visualization/Scene.ts'

export class DAWGLayout {
  public create(source: LinearModel, frame: LinearFrame = {}): Scene {
    const model = source as DAWG
    const states = model.getStates()
    let height = 0
    for (const state of states) height = Math.max(height, state.height)
    const nodes = StringTextScene.ranked(states.map((state) => ({ id: state.id, text: state.id === model.rootId ? 'start' : state.id,
      label: `${state.terminal ? 'accept word' : 'nonaccepting'} · height ${state.height}`, rank: height - state.height })))
    const edges: SceneEdge[] = []
    for (const state of states) for (const [character, target] of state.transitions) edges.push(LinearScene.edge(state.id, target, character))
    return LinearScene.create(model, nodes, edges, frame, 'dictionary words')
  }
}
