import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import { BPlusTree } from '../BPlusTree.ts'
import { RangeAnimation } from './RangeAnimation.ts'
import './RangeFromKey.css'

class RangeFromKeyDefinition implements ActionDefinition<BPlusTree> {
  public readonly title = 'Range from key'
  public readonly initialValue = 50

  public create(model: BPlusTree, value: number, upperValue?: number): RangeAnimation {
    return new RangeAnimation(model, value, upperValue)
  }
}

export default class RangeFromKey extends ActionView<BPlusTree> {
  protected readonly definition = new RangeFromKeyDefinition()
}
