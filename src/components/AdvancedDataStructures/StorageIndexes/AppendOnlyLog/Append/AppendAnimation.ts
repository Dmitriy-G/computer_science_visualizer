import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import type { LinearModel, LinearInputValues } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { AppendOnlyLogLayout } from '../AppendOnlyLogLayout.ts'

export class AppendAnimation extends LinearAnimation {
  public static readonly title = 'Append a record'
  public static readonly summary = 'Append a value at the next monotone offset.'

  public static describe(size: number): AlgorithmInformation {
    return {
      name: this.title,
      summary: this.summary,
      time: { best: 'O(1)', average: 'O(1)', worst: 'O(n)', explanation: 'Append one record to a segment of at most four records and update its Map entry. Existing segments are not copied. Average denotes expected amortized host-container insertion; a container growth or a linear worst-case Map operation can cost O(n).' },
      memory: { best: 'O(1)', average: 'O(1)', worst: 'O(n)', explanation: 'Allocate one record without container growth. Average allocation is amortized over insertions; backing-array or Map growth may allocate O(n) slots. Playback clones and snapshots are excluded.' },
      terms: [
        { symbol: 'O(1)', meaning: 'Constant work or allocation, amortized for host-container insertion.' },
        { symbol: 'n', meaning: `Logical entries before the operation; currently ${size}.` },
        { symbol: 'O(n)', meaning: 'Linear work or storage in the logical entry count.' },
      ],
    }
  }

  constructor(model: LinearModel, input: LinearInputValues = { value: 99 }) {
    super(model, new AppendOnlyLogLayout(), 'insert-end', input, AppendAnimation.title, AppendAnimation.summary)
  }
}
