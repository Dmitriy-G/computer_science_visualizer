import { CompressedMatrixModel } from '../CompressedMatrixModel.ts'

export class NumericalCSR extends CompressedMatrixModel {
  public readonly kind = 'numerical-csr'
  protected readonly columnMajor = false
  public static createDefault(): NumericalCSR {
    const model = new NumericalCSR()
    model.initialize()
    return model
  }
  public clone(): NumericalCSR {
    const model = new NumericalCSR()
    this.copyTo(model)
    return model
  }
}
