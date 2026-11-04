import { DenseArrayModel } from '../DenseArrayModel.ts'

export class Grid2D extends DenseArrayModel {
  public readonly kind = 'grid-2d'
  public static createDefault(): Grid2D {
    const model = new Grid2D()
    model.initialize()
    return model
  }
  public clone(): Grid2D {
    const model = new Grid2D()
    this.copyTo(model)
    return model
  }
}
