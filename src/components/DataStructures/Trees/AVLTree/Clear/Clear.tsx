import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import { AVLTree } from '../AVLTree.ts'
import { ClearAnimation } from './ClearAnimation.ts'
import './Clear.css'

class ClearDefinition implements ActionDefinition<AVLTree> {
  public readonly title = 'Clear'
  public readonly context = 'AVL tree / clear'
  public readonly summary = 'Release all nodes or pages after their children, without repeated balanced deletions.'
  public readonly phases = ['Inspect', 'Traverse', 'Release', 'Finalize', 'Finish']
  public readonly timelineHint = 'Unique keys / balanced search tree'
  public readonly acceptsValue = false

  public create(model: AVLTree): ClearAnimation {
    return new ClearAnimation(model)
  }
}

export default class Clear extends ActionView<AVLTree> {
  protected readonly definition = new ClearDefinition()
}
