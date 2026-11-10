import { ArraySortingPseudocode } from '../ArraySortingPseudocode.ts'
import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import { FixedArray } from '../../../../FundamentalDataStructures/Linear/Array/FixedArray.ts'
import { PatienceSortAnimation } from './PatienceSortAnimation.ts'
import './PatienceSort.css'

class PatienceSortDefinition implements ActionDefinition<FixedArray> {
  public readonly pseudocode = ArraySortingPseudocode.patienceSort
  public readonly title = 'Patience Sort'
  public readonly context = 'Sorting / Array / Patience Sort'
  public readonly summary = PatienceSortAnimation.describe(0).summary
  public readonly phases = ['Inspect', 'Locate', 'Move', 'Finish range', 'Commit']
  public readonly timelineHint = 'Deterministic sorting steps in the shared renderer'
  public readonly acceptsValue = false

  public create(model: FixedArray): PatienceSortAnimation {
    return new PatienceSortAnimation(model)
  }
}

export default class PatienceSort extends ActionView<FixedArray> {
  protected readonly definition = new PatienceSortDefinition()
}
