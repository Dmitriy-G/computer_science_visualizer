import { DenseTensor } from './DenseTensor.ts'
import { NumericalLayout } from '../../../../visualization/NumericalLayout.ts'
import type { LinearFrame, LinearModel } from '../../../../visualization/LinearModel.ts'
import type { Scene } from '../../../../visualization/Scene.ts'

export class DenseTensorLayout {
  public create(model: LinearModel, frame: LinearFrame = {}): Scene {
    if (!(model instanceof DenseTensor)) throw new TypeError('Expected DenseTensor')
    return new NumericalLayout().create(model, frame)
  }
}
