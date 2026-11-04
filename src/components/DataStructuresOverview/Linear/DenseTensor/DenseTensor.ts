import { DenseArrayModel } from '../DenseArrayModel.ts'

export class DenseTensor extends DenseArrayModel {
  public readonly kind = 'dense-tensor'
  public static createDefault(): DenseTensor {
    const model = new DenseTensor()
    model.initialize()
    return model
  }
  public clone(): DenseTensor {
    const model = new DenseTensor()
    this.copyTo(model)
    return model
  }
}
