import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import { Stack } from '../Stack.ts'
import { SearchAnimation } from './SearchAnimation.ts'
import './SearchByValue.css'

class SearchByValueDefinition implements ActionDefinition<Stack> {
  public readonly title = 'Search by value'
  public readonly initialValue = 70

  public create(model: Stack, value: number): SearchAnimation {
    return new SearchAnimation(model, value)
  }
}

export default class SearchByValue extends ActionView<Stack> {
  protected readonly definition = new SearchByValueDefinition()
}
