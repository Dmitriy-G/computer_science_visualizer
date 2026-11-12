import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import { Stack } from '../Stack.ts'
import { PushAnimation } from './PushAnimation.ts'
import './Push.css'

class PushDefinition implements ActionDefinition<Stack> {
  public readonly title = 'Push'
  public readonly initialValue = 99

  public create(model: Stack, value: number): PushAnimation {
    return new PushAnimation(model, value)
  }
}

export default class Push extends ActionView<Stack> {
  protected readonly definition = new PushDefinition()
}
