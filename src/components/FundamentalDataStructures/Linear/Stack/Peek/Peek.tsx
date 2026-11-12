import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import { Stack } from '../Stack.ts'
import { PeekAnimation } from './PeekAnimation.ts'
import './Peek.css'

class PeekDefinition implements ActionDefinition<Stack> {
  public readonly title = 'Peek (top)'

  public create(model: Stack): PeekAnimation {
    return new PeekAnimation(model)
  }
}

export default class Peek extends ActionView<Stack> {
  protected readonly definition = new PeekDefinition()
}
