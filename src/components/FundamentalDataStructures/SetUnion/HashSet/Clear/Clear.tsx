import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import { HashSet } from '../HashSet.ts'
import { ClearAnimation } from './ClearAnimation.ts'
import './Clear.css'

class ClearDefinition implements ActionDefinition<HashSet> {
  public readonly title = 'Clear'
  public readonly initialValue = 99

  public create(model: HashSet, value: number, storedValue?: number): ClearAnimation {
    return new ClearAnimation(model, value, storedValue)
  }
}

export default class Clear extends ActionView<HashSet> {
  protected readonly definition = new ClearDefinition()
}
