import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import { BloomFilter } from '../BloomFilter.ts'
import { AddAnimation } from './AddAnimation.ts'
import './Add.css'

class AddDefinition implements ActionDefinition<BloomFilter> {
  public readonly title = 'Add a value'
  public readonly initialValue = 99

  public create(model: BloomFilter, value: number, storedValue?: number): AddAnimation {
    return new AddAnimation(model, value, storedValue)
  }
}

export default class Add extends ActionView<BloomFilter> {
  protected readonly definition = new AddDefinition()
}
