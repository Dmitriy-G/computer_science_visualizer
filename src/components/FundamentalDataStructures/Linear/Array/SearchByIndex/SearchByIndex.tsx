import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import { FixedArray } from '../FixedArray.ts'
import { SearchAnimation } from './SearchAnimation.ts'
import './SearchByIndex.css'

class SearchDefinition implements ActionDefinition<FixedArray> {
  public readonly title = 'Search by index'
  public readonly initialValue = 4

  public create(model: FixedArray, value: number): SearchAnimation { return new SearchAnimation(model, value) }
}

export default class SearchByIndex extends ActionView<FixedArray> {
  protected readonly definition = new SearchDefinition()
}
