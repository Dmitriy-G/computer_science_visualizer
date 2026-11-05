import { ExtendedTreeAnimation } from '../../../../../visualization/ExtendedTreeAnimation.ts'
import type { AdditionalTreeModel, TreeInputValues } from '../../../../../visualization/AdditionalTreeModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { TwoThreeFourTreeLayout } from '../TwoThreeFourTreeLayout.ts'
export class InsertAnimation extends ExtendedTreeAnimation {
  public static readonly title = 'Insert a key'
  public static readonly summary = 'Insert a unique key using this tree\'s own placement and repair policy.'
  public static describe(size: number): AlgorithmInformation {
    return {
      name: this.title, summary: this.summary,
      time: { best: 'O(1)', average: 'O(log n)', worst: 'O(log n)', explanation: 'Balancing or equal-depth pages bounds the search and repair path logarithmically. A root match can return immediately; average is an upper bound for any key distribution. The constant best case is a root duplicate; a successful insertion descends and repairs its path.' },
      memory: { best: 'O(1)', average: 'O(1)', worst: 'O(log n)', explanation: 'A duplicate or an insertion without cascading splits needs constant additional space. Splitting full pages along the root-to-leaf path can allocate O(log n) pages. The average row is amortized over insertion-only unique-key sequences, not a random-input expectation. Playback storage is excluded.' },
      terms: [
        { symbol: 'n', meaning: `Original element count for this run: n = ${size}.` },
        { symbol: 'O(1)', meaning: 'Constant work or additional storage.' },
        { symbol: 'O(log n)', meaning: 'Work or storage proportional to balanced tree height.' },
      ],
    }
  }
  constructor(model: AdditionalTreeModel, input: TreeInputValues = {}) {
    super(model, new TwoThreeFourTreeLayout(), 'insert', input, InsertAnimation.title, InsertAnimation.summary)
  }
}
