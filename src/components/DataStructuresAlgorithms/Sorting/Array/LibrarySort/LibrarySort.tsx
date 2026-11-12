import { ArraySortingPseudocode } from '../ArraySortingPseudocode.ts'
import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import { FixedArray } from '../../../../FundamentalDataStructures/Linear/Array/FixedArray.ts'
import { LibrarySortAnimation } from './LibrarySortAnimation.ts'
import './LibrarySort.css'

class LibrarySortDefinition implements ActionDefinition<FixedArray> {
  public readonly pseudocode = ArraySortingPseudocode.librarySort
  public readonly title = 'Library Sort'

  public create(model: FixedArray): LibrarySortAnimation {
    return new LibrarySortAnimation(model)
  }
}

export default class LibrarySort extends ActionView<FixedArray> {
  protected readonly definition = new LibrarySortDefinition()
}
