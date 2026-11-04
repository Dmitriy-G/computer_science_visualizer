import { ExtendedGraphLayout } from '../../../../visualization/ExtendedGraphLayout.ts'
import type { LinearFrame, LinearModel } from '../../../../visualization/LinearModel.ts'
import type { Scene } from '../../../../visualization/Scene.ts'

export class CompleteGraphLayout extends ExtendedGraphLayout {
  public create(model: LinearModel, frame: LinearFrame = {}): Scene {
    if (model.kind !== 'complete-graph') throw new TypeError('Expected CompleteGraph')
    return super.create(model, frame)
  }
}
