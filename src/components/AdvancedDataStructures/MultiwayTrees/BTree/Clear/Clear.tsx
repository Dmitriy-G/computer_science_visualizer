import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import { BTree } from '../BTree.ts'
import { ClearAnimation } from './ClearAnimation.ts'
import './Clear.css'

class ClearDefinition implements ActionDefinition<BTree> {
  public readonly title = 'Clear'

  public create(model: BTree): ClearAnimation {
    return new ClearAnimation(model)
  }
}

export default class Clear extends ActionView<BTree> {
  protected readonly definition = new ClearDefinition()
}
