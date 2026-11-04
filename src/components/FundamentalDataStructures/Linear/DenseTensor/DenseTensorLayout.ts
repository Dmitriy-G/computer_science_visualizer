import { DenseTensor } from './DenseTensor.ts'
import { NumericalLayout } from '../../../../visualization/NumericalLayout.ts'
import type { LinearFrame, LinearModel } from '../../../../visualization/LinearModel.ts'
import type { Scene } from '../../../../visualization/Scene.ts'

export class DenseTensorLayout {
  public create(model: LinearModel, frame: LinearFrame = {}): Scene {
    if (!(model instanceof DenseTensor)) throw new TypeError('Expected DenseTensor')
    return new NumericalLayout().create(model, frame, { title: 'Dense Multidimensional Array / Tensor', description: 'A contiguous Float64Array stores every cell in row-major order. Shape has 1 to 4 axes; strides are measured in elements, not bytes. Offset = sum(coordinate[axis] * stride[axis]). Reshape preserves the same data allocation and order. This bounded integer lesson omits slicing, broadcasting, and arbitrary-stride views.' })
  }
}
