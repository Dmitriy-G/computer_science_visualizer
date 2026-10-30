import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import { FixedArray } from '../FixedArray.ts'
import { SearchAnimation } from './SearchAnimation.ts'
import './SearchByIndex.css'

class SearchDefinition implements ActionDefinition<FixedArray> {
  public readonly title = 'Search by index'
  public readonly context = 'Fixed array / search'
  public readonly summary = 'Read an indexed slot directly.'
  public readonly phases = ['Start', 'Examine', 'Result', 'Finish']
  public readonly timelineHint = 'Direct access'
  public readonly inputLabel = 'Index (zero-based)'
  public readonly initialValue = 4
  public readonly inputMinimum = 0
  public readonly inputMaximum = Number.MAX_SAFE_INTEGER

  public create(model: FixedArray, value: number): SearchAnimation { return new SearchAnimation(model, value) }
}

export default class SearchByIndex extends ActionView<FixedArray> {
  protected readonly definition = new SearchDefinition()
}
