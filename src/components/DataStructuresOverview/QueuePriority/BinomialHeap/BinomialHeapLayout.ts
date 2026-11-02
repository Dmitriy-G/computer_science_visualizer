import { PriorityLayout } from '../PriorityLayout.ts'
import type { LinearFrame, LinearModel } from '../../../../visualization/LinearModel.ts'
import type { Scene } from '../../../../visualization/Scene.ts'

export class BinomialHeapLayout extends PriorityLayout {
  public create(model: LinearModel, frame: LinearFrame = {}): Scene {
    if (model.kind !== 'binomial-heap') throw new TypeError('Expected BinomialHeap')
    return super.create(model, frame)
  }
}
