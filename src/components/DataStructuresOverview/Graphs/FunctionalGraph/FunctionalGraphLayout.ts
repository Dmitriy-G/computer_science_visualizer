import { ExtendedGraphLayout } from '../ExtendedGraphLayout.ts'
import type { LinearFrame, LinearModel } from '../../../../visualization/LinearModel.ts'
import type { Scene } from '../../../../visualization/Scene.ts'

export class FunctionalGraphLayout extends ExtendedGraphLayout {
  public create(model: LinearModel, frame: LinearFrame = {}): Scene {
    if (model.kind !== 'functional-graph') throw new TypeError('Expected FunctionalGraph')
    return super.create(model, frame)
  }
}
