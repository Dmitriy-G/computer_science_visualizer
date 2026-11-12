import { NumericalCSR } from './NumericalCSR.ts'
import { NumericalLayout } from '../../../../visualization/NumericalLayout.ts'
import type { LinearFrame, LinearModel } from '../../../../visualization/LinearModel.ts'
import type { Scene } from '../../../../visualization/Scene.ts'

export class NumericalCSRLayout {
  public create(model: LinearModel, frame: LinearFrame = {}): Scene {
    if (!(model instanceof NumericalCSR)) throw new TypeError('Expected NumericalCSR')
    return new NumericalLayout().create(model, frame)
  }
}
