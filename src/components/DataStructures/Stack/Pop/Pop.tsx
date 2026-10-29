import ActionView from '../../../ActionPlayback/ActionView.tsx'
import type { ActionDefinition } from '../../../../visualization/ActionDefinition.ts'
import { Stack } from '../Stack.ts'
import { PopAnimation } from './PopAnimation.ts'
import './Pop.css'

class PopDefinition implements ActionDefinition<Stack> {
  public readonly title = 'Pop'
  public readonly context = 'Stack / pop'
  public readonly summary = 'Remove and return the top value.'
  public readonly phases = ['Inspect', 'Lift', 'Update top', 'Finish']
  public readonly timelineHint = 'O(1) top removal'
  public readonly acceptsValue = false

  public create(model: Stack): PopAnimation {
    return new PopAnimation(model)
  }
}

export default class Pop extends ActionView<Stack> {
  protected readonly definition = new PopDefinition()
}
