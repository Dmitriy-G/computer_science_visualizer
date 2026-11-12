import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import { BloomFilter } from '../BloomFilter.ts'
import { CheckMembershipAnimation } from './CheckMembershipAnimation.ts'
import './CheckMembership.css'

class CheckMembershipDefinition implements ActionDefinition<BloomFilter> {
  public readonly title = 'Check membership'
  public readonly initialValue = 99

  public create(model: BloomFilter, value: number, storedValue?: number): CheckMembershipAnimation {
    return new CheckMembershipAnimation(model, value, storedValue)
  }
}

export default class CheckMembership extends ActionView<BloomFilter> {
  protected readonly definition = new CheckMembershipDefinition()
}
