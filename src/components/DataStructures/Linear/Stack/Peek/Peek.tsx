import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import { Stack } from '../Stack.ts'
import { PeekAnimation } from './PeekAnimation.ts'
import './Peek.css'

class PeekDefinition implements ActionDefinition<Stack> {
  public readonly title = 'Peek (top)'
  public readonly context = 'Stack / peek'
  public readonly summary = 'Read the top value without removing it.'
  public readonly phases = ['Inspect', 'Read', 'Finish']
  public readonly timelineHint = 'O(1) top access'
  public readonly acceptsValue = false

  public create(model: Stack): PeekAnimation {
    return new PeekAnimation(model)
  }
}

export default class Peek extends ActionView<Stack> {
  protected readonly definition = new PeekDefinition()
}
