import { ArraySortingPseudocode } from '../ArraySortingPseudocode.ts'
import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import { FixedArray } from '../../../../FundamentalDataStructures/Linear/Array/FixedArray.ts'
import { WikiSortAnimation } from './WikiSortAnimation.ts'
import './WikiSort.css'

class WikiSortDefinition implements ActionDefinition<FixedArray> {
  public readonly pseudocode = ArraySortingPseudocode.wikiSort
  public readonly title = 'WikiSort'

  public create(model: FixedArray): WikiSortAnimation {
    return new WikiSortAnimation(model)
  }
}

export default class WikiSort extends ActionView<FixedArray> {
  protected readonly definition = new WikiSortDefinition()
}
