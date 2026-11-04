import { SparseCSC } from './SparseCSC.ts'
import { NumericalLayout } from '../../../../visualization/NumericalLayout.ts'
import type { LinearFrame, LinearModel } from '../../../../visualization/LinearModel.ts'
import type { Scene } from '../../../../visualization/Scene.ts'

export class SparseCSCLayout {
  public create(model: LinearModel, frame: LinearFrame = {}): Scene {
    if (!(model instanceof SparseCSC)) throw new TypeError('Expected SparseCSC')
    return new NumericalLayout().create(model, frame, { title: 'Sparse CSC', description: 'columnPointers has columns + 1 entries. Column c occupies [columnPointers[c], columnPointers[c+1]); rowIndices and data align by packed index. Row indices are sorted within each column. Zero assignment removes storage; inserting shifts packed arrays and adjusts later pointers.' })
  }
}
