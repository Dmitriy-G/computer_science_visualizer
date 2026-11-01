import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import { FixedArray } from '../FixedArray.ts'
import { PairwiseSortingNetworkAnimation } from './PairwiseSortingNetworkAnimation.ts'
import './PairwiseSortingNetwork.css'

class PairwiseSortingNetworkDefinition implements ActionDefinition<FixedArray> {
  public readonly title = 'Pairwise Sorting Network'
  public readonly context = 'Sorting / Array / Pairwise Sorting Network'
  public readonly summary = PairwiseSortingNetworkAnimation.describe(0).summary
  public readonly phases = ['Inspect', 'Locate', 'Move', 'Finish range', 'Commit']
  public readonly timelineHint = 'Deterministic sorting steps in the shared renderer'
  public readonly acceptsValue = false

  public create(model: FixedArray): PairwiseSortingNetworkAnimation {
    return new PairwiseSortingNetworkAnimation(model)
  }
}

export default class PairwiseSortingNetwork extends ActionView<FixedArray> {
  protected readonly definition = new PairwiseSortingNetworkDefinition()
}
