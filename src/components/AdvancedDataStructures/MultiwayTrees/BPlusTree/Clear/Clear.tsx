import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import { BPlusTree } from '../BPlusTree.ts'
import { ClearAnimation } from './ClearAnimation.ts'
import './Clear.css'

class ClearDefinition implements ActionDefinition<BPlusTree> {
  public readonly title = 'Clear'

  public create(model: BPlusTree): ClearAnimation {
    return new ClearAnimation(model)
  }
}

export default class Clear extends ActionView<BPlusTree> {
  protected readonly definition = new ClearDefinition()
}
