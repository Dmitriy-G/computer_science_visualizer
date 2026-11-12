import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import { Stack } from '../Stack.ts'
import { PopAnimation } from './PopAnimation.ts'
import './Pop.css'

class PopDefinition implements ActionDefinition<Stack> {
  public readonly title = 'Pop'

  public create(model: Stack): PopAnimation {
    return new PopAnimation(model)
  }
}

export default class Pop extends ActionView<Stack> {
  protected readonly definition = new PopDefinition()
}
