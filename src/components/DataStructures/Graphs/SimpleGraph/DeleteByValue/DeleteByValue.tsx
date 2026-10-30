import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import { Graph } from '../Graph.ts'
import { DeletionAnimation } from './DeletionAnimation.ts'
import './DeleteByValue.css'

class DeletionDefinition implements ActionDefinition<Graph> {
  public readonly title = 'Delete by value'
  public readonly context = 'Graph / deletion'
  public readonly summary = 'Find and delete the first matching value. A missing value leaves the structure unchanged.'
  public readonly phases = ['Start', 'Search', 'Locate', 'Disconnect', 'Reconnect / remove', 'Finish']
  public readonly timelineHint = 'Commit only at the final step'
  public readonly inputLabel = 'Value to delete'
  public readonly initialValue = 50
  public create(model: Graph, value: number): DeletionAnimation { return new DeletionAnimation(model, value) }
}

export default class DeleteByValue extends ActionView<Graph> {
  protected readonly definition = new DeletionDefinition()
}
