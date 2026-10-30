import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import { BPlusTree } from '../BPlusTree.ts'
import { RangeAnimation } from './RangeAnimation.ts'
import './RangeFromValue.css'

class RangeFromValueDefinition implements ActionDefinition<BPlusTree> {
  public readonly title = 'Range from value'
  public readonly context = 'B+ Tree / range from value'
  public readonly summary = 'Report all leaf records at or above the inclusive minimum by following next-leaf links.'
  public readonly phases = ['Inspect', 'Locate', 'Follow leaves', 'Report', 'Finish']
  public readonly timelineHint = 'Unique keys / order 4'
  public readonly acceptsValue = true
  public readonly inputLabel = 'Minimum key (inclusive)'
  public readonly initialValue = 50

  public create(model: BPlusTree, value: number): RangeAnimation {
    return new RangeAnimation(model, value)
  }
}

export default class RangeFromValue extends ActionView<BPlusTree> {
  protected readonly definition = new RangeFromValueDefinition()
}
