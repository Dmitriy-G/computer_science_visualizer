import { PriorityLayout } from '../PriorityLayout.ts'
import type { LinearFrame, LinearModel } from '../../../../visualization/LinearModel.ts'
import type { Scene } from '../../../../visualization/Scene.ts'

export class PriorityQueueLayout extends PriorityLayout {
  public create(model: LinearModel, frame: LinearFrame = {}): Scene {
    if (model.kind !== 'priority-queue') throw new TypeError('Expected PriorityQueue')
    return super.create(model, frame)
  }
}
