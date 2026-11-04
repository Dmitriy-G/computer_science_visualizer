import { PriorityLayout } from '../../../../visualization/PriorityLayout.ts'
import type { LinearFrame, LinearModel } from '../../../../visualization/LinearModel.ts'
import type { Scene } from '../../../../visualization/Scene.ts'

export class FibonacciHeapLayout extends PriorityLayout {
  public create(model: LinearModel, frame: LinearFrame = {}): Scene {
    if (model.kind !== 'fibonacci-heap') throw new TypeError('Expected FibonacciHeap')
    return super.create(model, frame)
  }
}
