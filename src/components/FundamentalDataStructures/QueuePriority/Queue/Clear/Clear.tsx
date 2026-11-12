import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import { Queue } from '../Queue.ts'
import { ClearAnimation } from './ClearAnimation.ts'
import './Clear.css'

class ClearDefinition implements ActionDefinition<Queue> {
  public readonly title = 'Clear'

  public create(model: Queue, value: number): ClearAnimation {
    return new ClearAnimation(model)
  }
}

export default class Clear extends ActionView<Queue> {
  protected readonly definition = new ClearDefinition()
}
