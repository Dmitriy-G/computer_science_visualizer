import { SparseCSC } from './SparseCSC.ts'
import { NumericalLayout } from '../../../../visualization/NumericalLayout.ts'
import type { LinearFrame, LinearModel } from '../../../../visualization/LinearModel.ts'
import type { Scene } from '../../../../visualization/Scene.ts'

export class SparseCSCLayout {
  public create(model: LinearModel, frame: LinearFrame = {}): Scene {
    if (!(model instanceof SparseCSC)) throw new TypeError('Expected SparseCSC')
    return new NumericalLayout().create(model, frame)
  }
}
