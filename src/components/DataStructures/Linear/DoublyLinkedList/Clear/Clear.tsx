import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import { DoublyLinkedList } from '../DoublyLinkedList.ts'
import { ClearAnimation } from './ClearAnimation.ts'
import './Clear.css'

class ClearDefinition implements ActionDefinition<DoublyLinkedList> {
  public readonly title = 'Clear'
  public readonly context = 'Doubly linked list / clear'
  public readonly summary = 'Release nodes one at a time and empty both end pointers.'
  public readonly phases = ['Inspect', 'Release', 'Finish']
  public readonly timelineHint = 'Follow next and prev'
  public readonly acceptsValue = false

  public create(model: DoublyLinkedList, value: number): ClearAnimation {
    return new ClearAnimation(model)
  }
}

export default class Clear extends ActionView<DoublyLinkedList> {
  protected readonly definition = new ClearDefinition()
}
