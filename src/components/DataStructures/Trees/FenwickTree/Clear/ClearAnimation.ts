import { AdditionalTreeAnimation } from '../../../../../visualization/AdditionalTreeAnimation.ts'
import type { AdditionalTreeModel, TreeInputValues } from '../../../../../visualization/AdditionalTreeModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { FenwickTreeLayout } from '../FenwickTreeLayout.ts'

export class ClearAnimation extends AdditionalTreeAnimation {
  public static readonly title = 'Clear (reset to zero)'
  public static readonly summary = 'Zero each source value and BIT cell while preserving the indexed length.'

  public static describe(size: number, storage = size, runs = 0): AlgorithmInformation {
    return {
      name: this.title,
      summary: this.summary,
      time: { best: 'O(n)', average: 'O(n)', worst: 'O(n)', explanation: 'Each of n array positions and its BIT cell is reset once; empty input is constant.' },
      memory: { best: 'O(1)', average: 'O(1)', worst: 'O(1)', explanation: 'Zero the existing storage in one iterative pass. Animation snapshots and traces are excluded. Numeric sums count scalar cells; exact-integer arithmetic also depends on digit length.' },
      terms: [
        { symbol: 'n', meaning: `Original element count for this run: n = ${size}.` },
        { symbol: 'O(n)', meaning: 'Work or storage proportional to the original number of array values or stored records.' },
        { symbol: 'O(1)', meaning: 'Constant work or additional storage.' },
      ],
    }
  }

  constructor(model: AdditionalTreeModel, input: TreeInputValues = {}) {
    super(model, new FenwickTreeLayout(), 'clear', input, ClearAnimation.title, ClearAnimation.summary)
  }
}
