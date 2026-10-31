import { AdditionalTreeAnimation } from '../../../../../visualization/AdditionalTreeAnimation.ts'
import type { AdditionalTreeModel, TreeInputValues } from '../../../../../visualization/AdditionalTreeModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { RTreeLayout } from '../RTreeLayout.ts'

export class DeleteByIdAnimation extends AdditionalTreeAnimation {
  public static readonly title = 'Delete by rectangle ID'
  public static readonly summary = 'Scan for an ID, remove it, condense underfull pages, and reinsert orphan records.'

  public static describe(size: number, storage = size, runs = 0): AlgorithmInformation {
    return {
      name: this.title,
      summary: this.summary,
      time: { best: 'O(log n)', average: 'O(n)', worst: 'O(n log n)', explanation: 'IDs carry no spatial position, so average assumes a uniform matching ID and no cascading condensation: a linear scan. A first-visited match takes one path. Worst condensation reinserts up to n records.' },
      memory: { best: 'O(log n)', average: 'O(log n)', worst: 'O(n)', explanation: 'The ID scan uses a logarithmic recursion stack. Average assumes no underflow cascade; worst saves a linear collection of orphan records. Animation snapshots and traces are excluded.' },
      terms: [
        { symbol: 'n', meaning: `Original element count for this run: n = ${size}.` },
        { symbol: 'O(log n)', meaning: 'Work or storage proportional to balanced tree height.' },
        { symbol: 'O(n)', meaning: 'Work or storage proportional to the original number of array values or stored records.' },
        { symbol: 'O(n log n)', meaning: 'Up to a linear number of balanced-path reinsertion operations.' },
      ],
    }
  }

  constructor(model: AdditionalTreeModel, input: TreeInputValues = {}) {
    super(model, new RTreeLayout(), 'delete-value', input, DeleteByIdAnimation.title, DeleteByIdAnimation.summary)
  }
}
