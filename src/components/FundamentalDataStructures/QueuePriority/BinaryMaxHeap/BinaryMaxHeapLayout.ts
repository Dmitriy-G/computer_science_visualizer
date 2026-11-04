import { PriorityLayout } from '../../../../visualization/PriorityLayout.ts'
import type { LinearFrame, LinearModel } from '../../../../visualization/LinearModel.ts'
import type { Scene } from '../../../../visualization/Scene.ts'

export class BinaryMaxHeapLayout extends PriorityLayout {
  public create(model: LinearModel, frame: LinearFrame = {}): Scene {
    if (model.kind !== 'binary-max-heap') throw new TypeError('Expected BinaryMaxHeap')
    return super.create(model, frame)
  }
}
