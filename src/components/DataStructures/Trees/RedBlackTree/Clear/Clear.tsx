import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import { RedBlackTree } from '../RedBlackTree.ts'
import { ClearAnimation } from './ClearAnimation.ts'
import './Clear.css'

class ClearDefinition implements ActionDefinition<RedBlackTree> {
  public readonly title = 'Clear'
  public readonly context = 'Red-Black tree / clear'
  public readonly summary = 'Release all nodes or pages after their children, without repeated balanced deletions.'
  public readonly phases = ['Inspect', 'Traverse', 'Release', 'Finalize', 'Finish']
  public readonly timelineHint = 'Unique keys / balanced search tree'
  public readonly acceptsValue = false

  public create(model: RedBlackTree): ClearAnimation {
    return new ClearAnimation(model)
  }
}

export default class Clear extends ActionView<RedBlackTree> {
  protected readonly definition = new ClearDefinition()
}
