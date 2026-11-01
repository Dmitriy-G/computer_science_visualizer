import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import { FixedArray } from '../FixedArray.ts'
import { LibrarySortAnimation } from './LibrarySortAnimation.ts'
import './LibrarySort.css'

class LibrarySortDefinition implements ActionDefinition<FixedArray> {
  public readonly title = 'Library Sort'
  public readonly context = 'Sorting / Array / Library Sort'
  public readonly summary = LibrarySortAnimation.describe(0).summary
  public readonly phases = ['Inspect', 'Locate', 'Move', 'Finish range', 'Commit']
  public readonly timelineHint = 'Deterministic sorting steps in the shared renderer'
  public readonly acceptsValue = false

  public create(model: FixedArray): LibrarySortAnimation {
    return new LibrarySortAnimation(model)
  }
}

export default class LibrarySort extends ActionView<FixedArray> {
  protected readonly definition = new LibrarySortDefinition()
}
