import { SuffixAutomaton } from './SuffixAutomaton.ts'
import { LinearScene } from '../../../../visualization/LinearScene.ts'
import { StringTextScene } from '../../../../visualization/StringTextScene.ts'
import type { LinearFrame, LinearModel } from '../../../../visualization/LinearModel.ts'
import type { Scene, SceneEdge } from '../../../../visualization/Scene.ts'

export class SuffixAutomatonLayout {
  public create(source: LinearModel, frame: LinearFrame = {}): Scene {
    const model = source as SuffixAutomaton
    const states = model.getStates()
    const nodes = StringTextScene.ranked(states.map((state) => ({ id: state.id, text: state.id === 'sam-root' ? 'root' : state.id,
      label: `max ${state.maximum}${state.clone ? ' · clone' : ''}${state.terminal ? ' · suffix end' : ''}`, rank: state.maximum })))
    const edges: SceneEdge[] = []
    for (const state of states) {
      for (const [character, target] of state.transitions) edges.push(LinearScene.edge(state.id, target, character))
      if (state.link) edges.push({ ...LinearScene.edge(state.id, state.link, 'suffix'), curveOffset: 40 })
    }
    return LinearScene.create(model, nodes, edges, frame, {
      title: `Online suffix automaton · source: ${model.source || 'empty'}`,
      description: 'Character edges recognize all source substrings. Suffix links point to shorter end-position classes; clone states split a class when a direct extension is too long. Maximum length increases along character transitions and decreases along suffix links. Suffix-end states recognize complete suffixes; substring membership accepts every reachable state. Build replaces the source; Append extends it online, up to 64 characters.',
      code: 'create cur; add missing transitions along suffix links; clone q when max[p] + 1 < max[q]',
    }, 'source characters')
  }
}
