import { ArraySortingPseudocode } from '../ArraySortingPseudocode.ts'
import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import { FixedArray } from '../../../../FundamentalDataStructures/Linear/Array/FixedArray.ts'
import { CocktailShakerSortAnimation } from './CocktailShakerSortAnimation.ts'
import './CocktailShakerSort.css'

class CocktailShakerSortDefinition implements ActionDefinition<FixedArray> {
  public readonly pseudocode = ArraySortingPseudocode.cocktailShakerSort
  public readonly title = 'Cocktail Shaker Sort'

  public create(model: FixedArray): CocktailShakerSortAnimation {
    return new CocktailShakerSortAnimation(model)
  }
}

export default class CocktailShakerSort extends ActionView<FixedArray> {
  protected readonly definition = new CocktailShakerSortDefinition()
}
