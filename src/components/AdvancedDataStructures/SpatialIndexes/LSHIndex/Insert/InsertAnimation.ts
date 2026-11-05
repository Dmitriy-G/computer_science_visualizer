import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import type { LinearModel, LinearInputValues } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { LSHIndexLayout } from '../LSHIndexLayout.ts'

export class InsertAnimation extends LinearAnimation {
  public static readonly title = 'Insert and encode a vector'
  public static readonly summary = 'Compute eight projection signs and retain the vector code.'

  public static describe(size: number): AlgorithmInformation {
    return {
      name: this.title,
      summary: this.summary,
      time: { best: 'O(1)', average: 'O(1)', worst: 'O(n)', explanation: 'Encode one 2D point using eight fixed planes, then append one code/point record. No existing vector is copied. Average denotes expected amortized host-container insertion; a backing-array growth can copy O(n) entries.' },
      memory: { best: 'O(1)', average: 'O(1)', worst: 'O(n)', explanation: 'Allocate one record without container growth. Average allocation is amortized over insertions; backing-array growth may allocate O(n) slots. Playback clones and snapshots are excluded.' },
      terms: [
        { symbol: 'O(1)', meaning: 'Constant work or allocation, amortized for host-container insertion.' },
        { symbol: 'n', meaning: `Logical entries before the operation; currently ${size}.` },
        { symbol: 'O(n)', meaning: 'Linear work or storage in the logical entry count.' },
      ],
    }
  }

  constructor(model: LinearModel, input: LinearInputValues = { x: 10, y: 10 }) {
    super(model, new LSHIndexLayout(), 'insert', input, InsertAnimation.title, InsertAnimation.summary)
  }
}
