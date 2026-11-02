import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import { BinaryTree } from '../BinaryTree.ts'
import { ClearAnimation } from './ClearAnimation.ts'
import './Clear.css'

class ClearDefinition implements ActionDefinition<BinaryTree> {
  public readonly title = 'Clear'
  public readonly context = 'Binary search tree / clear'
  public readonly summary = 'Clear children before their parent using postorder traversal.'
  public readonly phases = ['Inspect', 'Traverse', 'Release', 'Finish']
  public readonly timelineHint = 'Left subtree, right subtree, parent'
  public readonly acceptsValue = false

  public create(model: BinaryTree): ClearAnimation {
    return new ClearAnimation(model)
  }
}

export default class Clear extends ActionView<BinaryTree> {
  protected readonly definition = new ClearDefinition()
}
