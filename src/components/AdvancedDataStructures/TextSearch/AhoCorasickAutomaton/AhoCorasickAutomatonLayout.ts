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
    return LinearScene.create(model, nodes, edges, frame, {
      title: 'Pattern trie + failure links + terminal output links',
      description: 'Build distinct patterns, then assign fallback links breadth first. A scan consumes each text character once, following failure links when a transition is missing. Output links reach shorter terminal patterns without copying output sets. Report every overlap using zero-based [start, end) ranges. Patterns stay stored; scanning does not edit the dictionary. Dictionary input supports 16 words and 128 total letters; scan text supports 128 letters.',
      code: 'while missing(state, c): state = fail[state]; consume c; report terminal state and output chain',
    }, 'dictionary patterns')
  }
}
