import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import { RedBlackTree } from '../RedBlackTree.ts'
import { ClearAnimation } from './ClearAnimation.ts'
import './Clear.css'

class ClearDefinition implements ActionDefinition<RedBlackTree> {
  public readonly title = 'Clear'

  public create(model: RedBlackTree): ClearAnimation {
    return new ClearAnimation(model)
  }
}

export default class Clear extends ActionView<RedBlackTree> {
  protected readonly definition = new ClearDefinition()
}
