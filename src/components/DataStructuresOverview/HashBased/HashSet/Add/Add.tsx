import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import { HashSet } from '../HashSet.ts'
import { AddAnimation } from './AddAnimation.ts'
import './Add.css'

class AddDefinition implements ActionDefinition<HashSet> {
  public readonly title = 'Add a value'
  public readonly context = 'HashSet / Add a value'
  public readonly summary = 'Add a value using deterministic hash probes.'
  public readonly phases = ['Start', 'Hash', 'Access storage', 'Finish']
  public readonly timelineHint = 'Follow each hash and storage access'
  public readonly initialValue = 99

  public create(model: HashSet, value: number, storedValue?: number): AddAnimation {
    return new AddAnimation(model, value, storedValue)
  }
}

export default class Add extends ActionView<HashSet> {
  protected readonly definition = new AddDefinition()
}
