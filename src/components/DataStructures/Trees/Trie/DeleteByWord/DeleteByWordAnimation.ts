import { AdditionalTreeAnimation } from '../../../../../visualization/AdditionalTreeAnimation.ts'
import type { AdditionalTreeModel, TreeInputValues } from '../../../../../visualization/AdditionalTreeModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { TrieLayout } from '../TrieLayout.ts'

export class DeleteByWordAnimation extends AdditionalTreeAnimation {
  public static readonly title = 'Delete a word'
  public static readonly summary = 'Unmark a complete word and prune unused suffix nodes through parent links.'

  public static describe(size: number, storage = size, runs = 0): AlgorithmInformation {
    return {
      name: this.title,
      summary: this.summary,
      time: { best: 'O(1)', average: 'O(L)', worst: 'O(L)', explanation: 'A first-letter miss stops immediately; average assumes uniformly distributed failure depths or matching words. A deletion can read and prune L letters.' },
      memory: { best: 'O(1)', average: 'O(1)', worst: 'O(1)', explanation: 'Cached parent references allow iterative pruning without a path array. Animation snapshots and traces are excluded.' },
      terms: [
        { symbol: 'L', meaning: 'Number of letters in the requested word or prefix.' },
        { symbol: 'O(1)', meaning: 'Constant work or additional storage.' },
        { symbol: 'O(L)', meaning: 'Work or newly allocated prefix nodes proportional to the requested word length.' },
      ],
    }
  }

  constructor(model: AdditionalTreeModel, input: TreeInputValues = {}) {
    super(model, new TrieLayout(), 'delete-value', input, DeleteByWordAnimation.title, DeleteByWordAnimation.summary)
  }
}
