import ActionView from '../../../ActionPlayback/ActionView.tsx'
import type { ActionDefinition } from '../../../../visualization/ActionDefinition.ts'
import { Graph } from '../Graph.ts'
import { SearchAnimation } from './SearchAnimation.ts'
import './SearchByValue.css'

class SearchDefinition implements ActionDefinition<Graph> {
  public readonly title = 'Search by value'
  public readonly context = 'Graph / search'
  public readonly summary = 'Search breadth-first across every connected component.'
  public readonly phases = ['Start', 'Examine', 'Result', 'Finish']
  public readonly timelineHint = 'Follow the highlighted search path'
  public readonly inputLabel = 'Value to find'
  public readonly initialValue = 70

  public create(model: Graph, value: number): SearchAnimation { return new SearchAnimation(model, value) }
}

export default class SearchByValue extends ActionView<Graph> {
  protected readonly definition = new SearchDefinition()
}
