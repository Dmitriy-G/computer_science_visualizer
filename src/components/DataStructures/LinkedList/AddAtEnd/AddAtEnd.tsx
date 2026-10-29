import ActionView from '../../../ActionPlayback/ActionView.tsx'
import type { ActionDefinition } from '../../../../visualization/ActionDefinition.ts'
import { LinkedList } from '../LinkedList.ts'
import { InsertionAnimation } from './InsertionAnimation.ts'
import './AddAtEnd.css'

class InsertionDefinition implements ActionDefinition<LinkedList> {
  public readonly title = 'Insert at the end'
  public readonly context = 'Linked list / insertion'
  public readonly summary = 'Traverse from the head to the last node, then append. This list has no cached tail pointer.'
  public readonly phases = ['Start', 'Traverse', 'Create', 'Position', 'Connect', 'Finish']
  public readonly timelineHint = 'Follow the pointer updates'
  public create(model: LinkedList, value: number): InsertionAnimation { return new InsertionAnimation(model, value) }
}

export default class AddAtEnd extends ActionView<LinkedList> {
  protected readonly definition = new InsertionDefinition()
}
