import { ArraySortingPseudocode } from '../ArraySortingPseudocode.ts'
import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import { FixedArray } from '../../../../FundamentalDataStructures/Linear/Array/FixedArray.ts'
import { PairwiseSortingNetworkAnimation } from './PairwiseSortingNetworkAnimation.ts'
import './PairwiseSortingNetwork.css'

class PairwiseSortingNetworkDefinition implements ActionDefinition<FixedArray> {
  public readonly pseudocode = ArraySortingPseudocode.pairwiseSortingNetwork
  public readonly title = 'Pairwise Sorting Network'

  public create(model: FixedArray): PairwiseSortingNetworkAnimation {
    return new PairwiseSortingNetworkAnimation(model)
  }
}

export default class PairwiseSortingNetwork extends ActionView<FixedArray> {
  protected readonly definition = new PairwiseSortingNetworkDefinition()
}
