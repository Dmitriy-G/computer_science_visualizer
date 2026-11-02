import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import { FixedArray } from '../../../../DataStructuresOverview/Linear/Array/FixedArray.ts'
import { DualPivotQuickSortAnimation } from './DualPivotQuickSortAnimation.ts'
import './DualPivotQuickSort.css'

class DualPivotQuickSortDefinition implements ActionDefinition<FixedArray> {
  public readonly title = 'Dual-Pivot QuickSort'
  public readonly context = 'Sorting / Array / Dual-Pivot QuickSort'
  public readonly summary = DualPivotQuickSortAnimation.describe(0).summary
  public readonly phases = ['Inspect', 'Locate', 'Move', 'Finish range', 'Commit']
  public readonly timelineHint = 'Deterministic sorting steps in the shared renderer'
  public readonly acceptsValue = false

  public create(model: FixedArray): DualPivotQuickSortAnimation {
    return new DualPivotQuickSortAnimation(model)
  }
}

export default class DualPivotQuickSort extends ActionView<FixedArray> {
  protected readonly definition = new DualPivotQuickSortDefinition()
}
