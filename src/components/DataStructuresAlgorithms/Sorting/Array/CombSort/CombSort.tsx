import { ArraySortingPseudocode } from '../ArraySortingPseudocode.ts'
import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import { FixedArray } from '../../../../FundamentalDataStructures/Linear/Array/FixedArray.ts'
import { CombSortAnimation } from './CombSortAnimation.ts'
import './CombSort.css'

class CombSortDefinition implements ActionDefinition<FixedArray> {
  public readonly pseudocode = ArraySortingPseudocode.combSort
  public readonly title = 'Comb Sort'
  public readonly context = 'Sorting / Array / Comb Sort'
  public readonly summary = CombSortAnimation.describe(0).summary
  public readonly phases = ['Inspect', 'Locate', 'Move', 'Finish range', 'Commit']
  public readonly timelineHint = 'Deterministic sorting steps in the shared renderer'
  public readonly acceptsValue = false

  public create(model: FixedArray): CombSortAnimation {
    return new CombSortAnimation(model)
  }
}

export default class CombSort extends ActionView<FixedArray> {
  protected readonly definition = new CombSortDefinition()
}
