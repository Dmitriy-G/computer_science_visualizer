import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import { LinkedList } from '../LinkedList.ts'
import { DeletionAnimation } from './DeletionAnimation.ts'
import './DeleteByValue.css'

class DeletionDefinition implements ActionDefinition<LinkedList> {
  public readonly title = 'Delete by value'
  public readonly initialValue = 50
  public create(model: LinkedList, value: number): DeletionAnimation { return new DeletionAnimation(model, value) }
}

export default class DeleteByValue extends ActionView<LinkedList> {
  protected readonly definition = new DeletionDefinition()
}
