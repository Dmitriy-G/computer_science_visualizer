import { SparseCOO } from './SparseCOO.ts'
import { NumericalLayout } from '../NumericalLayout.ts'
import type { LinearFrame, LinearModel } from '../../../../visualization/LinearModel.ts'
import type { Scene } from '../../../../visualization/Scene.ts'

export class SparseCOOLayout {
  public create(model: LinearModel, frame: LinearFrame = {}): Scene {
    if (!(model instanceof SparseCOO)) throw new TypeError('Expected SparseCOO')
    return new NumericalLayout().create(model, frame, { title: 'Sparse COO', description: 'Parallel rows, columns, and data arrays store coordinate triplets. Missing coordinates are zero; duplicates contribute their sum. Append retains explicit zeros and duplicate coordinates. Set replaces all matching triplets. Coalesce insertion-sorts by row and column, sums duplicates, and removes zero sums.' })
  }
}
