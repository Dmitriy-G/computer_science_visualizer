import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import { LinkedList } from '../LinkedList.ts'
import { ClearAnimation } from './ClearAnimation.ts'
import './Clear.css'

class ClearDefinition implements ActionDefinition<LinkedList> {
  public readonly title = 'Clear'

  public create(model: LinkedList): ClearAnimation {
    return new ClearAnimation(model)
  }
}

export default class Clear extends ActionView<LinkedList> {
  protected readonly definition = new ClearDefinition()
}
