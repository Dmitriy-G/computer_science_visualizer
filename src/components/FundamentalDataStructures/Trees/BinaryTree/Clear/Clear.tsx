import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import { BinaryTree } from '../BinaryTree.ts'
import { ClearAnimation } from './ClearAnimation.ts'
import './Clear.css'

class ClearDefinition implements ActionDefinition<BinaryTree> {
  public readonly title = 'Clear'

  public create(model: BinaryTree): ClearAnimation {
    return new ClearAnimation(model)
  }
}

export default class Clear extends ActionView<BinaryTree> {
  protected readonly definition = new ClearDefinition()
}
