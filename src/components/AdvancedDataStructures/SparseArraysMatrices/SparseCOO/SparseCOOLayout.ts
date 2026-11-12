import { SparseCOO } from './SparseCOO.ts'
import { NumericalLayout } from '../../../../visualization/NumericalLayout.ts'
import type { LinearFrame, LinearModel } from '../../../../visualization/LinearModel.ts'
import type { Scene } from '../../../../visualization/Scene.ts'

export class SparseCOOLayout {
  public create(model: LinearModel, frame: LinearFrame = {}): Scene {
    if (!(model instanceof SparseCOO)) throw new TypeError('Expected SparseCOO')
    return new NumericalLayout().create(model, frame)
  }
}
