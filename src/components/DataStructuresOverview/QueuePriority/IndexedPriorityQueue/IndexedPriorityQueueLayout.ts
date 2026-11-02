import { PriorityLayout } from '../PriorityLayout.ts'
import type { LinearFrame, LinearModel } from '../../../../visualization/LinearModel.ts'
import type { Scene } from '../../../../visualization/Scene.ts'

export class IndexedPriorityQueueLayout extends PriorityLayout {
  public create(model: LinearModel, frame: LinearFrame = {}): Scene {
    if (model.kind !== 'indexed-priority-queue') throw new TypeError('Expected IndexedPriorityQueue')
    return super.create(model, frame)
  }
}
