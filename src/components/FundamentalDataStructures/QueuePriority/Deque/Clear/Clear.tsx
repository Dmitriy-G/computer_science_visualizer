import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import { Deque } from '../Deque.ts'
import { ClearAnimation } from './ClearAnimation.ts'
import './Clear.css'

class ClearDefinition implements ActionDefinition<Deque> {
  public readonly title = 'Clear'

  public create(model: Deque, value: number): ClearAnimation {
    return new ClearAnimation(model)
  }
}

export default class Clear extends ActionView<Deque> {
  protected readonly definition = new ClearDefinition()
}
