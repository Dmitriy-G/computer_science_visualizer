import { LinearModel } from '../../../visualization/LinearModel.ts'
import type { LinearResult } from '../../../visualization/LinearModel.ts'

export abstract class ProbabilisticModel extends LinearModel {
  protected count = 0

  public get length(): number { return this.count }

  protected rejected(description: string): LinearResult {
    return { description, status: 'REJECTED' }
  }
}
