import { ArraySortingPseudocode } from '../ArraySortingPseudocode.ts'
import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import { FixedArray } from '../../../../FundamentalDataStructures/Linear/Array/FixedArray.ts'
import { GnomeSortAnimation } from './GnomeSortAnimation.ts'
import './GnomeSort.css'

class GnomeSortDefinition implements ActionDefinition<FixedArray> {
  public readonly pseudocode = ArraySortingPseudocode.gnomeSort
  public readonly title = 'Gnome Sort'

  public create(model: FixedArray): GnomeSortAnimation {
    return new GnomeSortAnimation(model)
  }
}

export default class GnomeSort extends ActionView<FixedArray> {
  protected readonly definition = new GnomeSortDefinition()
}
