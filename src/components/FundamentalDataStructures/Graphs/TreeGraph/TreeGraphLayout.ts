import { ExtendedGraphLayout } from '../../../../visualization/ExtendedGraphLayout.ts'
import type { LinearFrame, LinearModel } from '../../../../visualization/LinearModel.ts'
import type { Scene } from '../../../../visualization/Scene.ts'

export class TreeGraphLayout extends ExtendedGraphLayout {
  public create(model: LinearModel, frame: LinearFrame = {}): Scene {
    if (model.kind !== 'tree-graph') throw new TypeError('Expected TreeGraph')
    return super.create(model, frame)
  }
}
