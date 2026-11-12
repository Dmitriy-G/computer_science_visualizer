import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import { BloomFilter } from '../BloomFilter.ts'
import { ClearAnimation } from './ClearAnimation.ts'
import './Clear.css'

class ClearDefinition implements ActionDefinition<BloomFilter> {
  public readonly title = 'Clear'
  public readonly initialValue = 99

  public create(model: BloomFilter, value: number, storedValue?: number): ClearAnimation {
    return new ClearAnimation(model, value, storedValue)
  }
}

export default class Clear extends ActionView<BloomFilter> {
  protected readonly definition = new ClearDefinition()
}
