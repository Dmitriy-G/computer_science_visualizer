import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import { HashSet } from '../HashSet.ts'
import { RemoveAnimation } from './RemoveAnimation.ts'
import './Remove.css'

class RemoveDefinition implements ActionDefinition<HashSet> {
  public readonly title = 'Remove a value'
  public readonly initialValue = 99

  public create(model: HashSet, value: number, storedValue?: number): RemoveAnimation {
    return new RemoveAnimation(model, value, storedValue)
  }
}

export default class Remove extends ActionView<HashSet> {
  protected readonly definition = new RemoveDefinition()
}
