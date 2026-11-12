import { ArraySortingPseudocode } from '../ArraySortingPseudocode.ts'
import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import { FixedArray } from '../../../../FundamentalDataStructures/Linear/Array/FixedArray.ts'
import { TournamentSortAnimation } from './TournamentSortAnimation.ts'
import './TournamentSort.css'

class TournamentSortDefinition implements ActionDefinition<FixedArray> {
  public readonly pseudocode = ArraySortingPseudocode.tournamentSort
  public readonly title = 'Tournament Sort'

  public create(model: FixedArray): TournamentSortAnimation {
    return new TournamentSortAnimation(model)
  }
}

export default class TournamentSort extends ActionView<FixedArray> {
  protected readonly definition = new TournamentSortDefinition()
}
