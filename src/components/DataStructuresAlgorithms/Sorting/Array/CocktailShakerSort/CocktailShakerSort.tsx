import { ArraySortingPseudocode } from '../ArraySortingPseudocode.ts'
import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import { FixedArray } from '../../../../FundamentalDataStructures/Linear/Array/FixedArray.ts'
import { CocktailShakerSortAnimation } from './CocktailShakerSortAnimation.ts'
import './CocktailShakerSort.css'

class CocktailShakerSortDefinition implements ActionDefinition<FixedArray> {
  public readonly pseudocode = ArraySortingPseudocode.cocktailShakerSort
  public readonly title = 'Cocktail Shaker Sort'
  public readonly context = 'Sorting / Array / Cocktail Shaker Sort'
  public readonly summary = CocktailShakerSortAnimation.describe(0).summary
  public readonly phases = ['Inspect', 'Locate', 'Move', 'Finish range', 'Commit']
  public readonly timelineHint = 'Deterministic sorting steps in the shared renderer'
  public readonly acceptsValue = false

  public create(model: FixedArray): CocktailShakerSortAnimation {
    return new CocktailShakerSortAnimation(model)
  }
}

export default class CocktailShakerSort extends ActionView<FixedArray> {
  protected readonly definition = new CocktailShakerSortDefinition()
}
