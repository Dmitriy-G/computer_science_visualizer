import { ExtendedGraphLayout } from '../ExtendedGraphLayout.ts'
import type { LinearFrame, LinearModel } from '../../../../visualization/LinearModel.ts'
import type { Scene } from '../../../../visualization/Scene.ts'

export class BipartiteGraphLayout extends ExtendedGraphLayout {
  public create(model: LinearModel, frame: LinearFrame = {}): Scene {
    if (model.kind !== 'bipartite-graph') throw new TypeError('Expected BipartiteGraph')
    return super.create(model, frame)
  }
}
