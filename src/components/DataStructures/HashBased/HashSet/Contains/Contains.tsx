import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import { HashSet } from '../HashSet.ts'
import { ContainsAnimation } from './ContainsAnimation.ts'
import './Contains.css'

class ContainsDefinition implements ActionDefinition<HashSet> {
  public readonly title = 'Contains value'
  public readonly context = 'HashSet / Contains value'
  public readonly summary = 'Contains value using deterministic hash probes.'
  public readonly phases = ['Start', 'Hash', 'Access storage', 'Finish']
  public readonly timelineHint = 'Follow each hash and storage access'
  public readonly initialValue = 99

  public create(model: HashSet, value: number, storedValue?: number): ContainsAnimation {
    return new ContainsAnimation(model, value, storedValue)
  }
}

export default class Contains extends ActionView<HashSet> {
  protected readonly definition = new ContainsDefinition()
}
