import { PriorityLayout } from '../PriorityLayout.ts'
import type { LinearFrame, LinearModel } from '../../../../visualization/LinearModel.ts'
import type { Scene } from '../../../../visualization/Scene.ts'

export class LeftistHeapLayout extends PriorityLayout {
  public create(model: LinearModel, frame: LinearFrame = {}): Scene {
    if (model.kind !== 'leftist-heap') throw new TypeError('Expected LeftistHeap')
    return super.create(model, frame)
  }
}
