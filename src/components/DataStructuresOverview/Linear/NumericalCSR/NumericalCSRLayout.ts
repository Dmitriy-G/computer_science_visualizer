import { NumericalCSR } from './NumericalCSR.ts'
import { NumericalLayout } from '../NumericalLayout.ts'
import type { LinearFrame, LinearModel } from '../../../../visualization/LinearModel.ts'
import type { Scene } from '../../../../visualization/Scene.ts'

export class NumericalCSRLayout {
  public create(model: LinearModel, frame: LinearFrame = {}): Scene {
    if (!(model instanceof NumericalCSR)) throw new TypeError('Expected NumericalCSR')
    return new NumericalLayout().create(model, frame, { title: 'Numerical CSR', description: 'rowPointers has rows + 1 entries. Row r occupies [rowPointers[r], rowPointers[r+1]); columnIndices and numerical data align by packed index. Column indices are sorted within each row. This is a numerical matrix, distinct from the binary graph CSR entry. Zero assignment removes storage.' })
  }
}
