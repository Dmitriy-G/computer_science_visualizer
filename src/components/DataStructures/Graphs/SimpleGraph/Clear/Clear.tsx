import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import { Graph } from '../Graph.ts'
import { ClearAnimation } from './ClearAnimation.ts'
import './Clear.css'

class ClearDefinition implements ActionDefinition<Graph> {
  public readonly title = 'Clear'
  public readonly context = 'Graph / clear'
  public readonly summary = 'Release all adjacency records, then every vertex.'
  public readonly phases = ['Inspect', 'Edges', 'Vertices', 'Finish']
  public readonly timelineHint = 'Includes isolated vertices and disconnected components'
  public readonly acceptsValue = false

  public create(model: Graph): ClearAnimation {
    return new ClearAnimation(model)
  }
}

export default class Clear extends ActionView<Graph> {
  protected readonly definition = new ClearDefinition()
}
