import { ArraySortingPseudocode } from '../ArraySortingPseudocode.ts'
import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import { FixedArray } from '../../../../FundamentalDataStructures/Linear/Array/FixedArray.ts'
import { TreeSortAnimation } from './TreeSortAnimation.ts'
import './TreeSort.css'

class TreeSortDefinition implements ActionDefinition<FixedArray> {
  public readonly pseudocode = ArraySortingPseudocode.treeSort
  public readonly title = 'Tree Sort'

  public create(model: FixedArray): TreeSortAnimation {
    return new TreeSortAnimation(model)
  }
}

export default class TreeSort extends ActionView<FixedArray> {
  protected readonly definition = new TreeSortDefinition()
}
