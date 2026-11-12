import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import { DoublyLinkedList } from '../DoublyLinkedList.ts'
import { RemovalAnimation } from './RemovalAnimation.ts'
import './DeleteAtStart.css'

class DeleteAtStartDefinition implements ActionDefinition<DoublyLinkedList> {
  public readonly title = 'Delete at the start'

  public create(model: DoublyLinkedList, value: number): RemovalAnimation {
    return new RemovalAnimation(model)
  }
}

export default class DeleteAtStart extends ActionView<DoublyLinkedList> {
  protected readonly definition = new DeleteAtStartDefinition()
}
