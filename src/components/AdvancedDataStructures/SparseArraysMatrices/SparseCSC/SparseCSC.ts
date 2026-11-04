import { CompressedMatrixModel } from '../CompressedMatrixModel.ts'

export class SparseCSC extends CompressedMatrixModel {
  public readonly kind = 'sparse-csc'
  protected readonly columnMajor = true
  constructor() {
    super()
    this.pointers = new Array<number>(6).fill(0)
  }
  public static createDefault(): SparseCSC {
    const model = new SparseCSC()
    model.initialize()
    return model
  }
  public clone(): SparseCSC {
    const model = new SparseCSC()
    this.copyTo(model)
    return model
  }
}
