import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import { Stack } from '../Stack.ts'
import { ClearAnimation } from './ClearAnimation.ts'
import './Clear.css'

class ClearDefinition implements ActionDefinition<Stack> {
  public readonly title = 'Clear'

  public create(model: Stack): ClearAnimation {
    return new ClearAnimation(model)
  }
}

export default class Clear extends ActionView<Stack> {
  protected readonly definition = new ClearDefinition()
}
