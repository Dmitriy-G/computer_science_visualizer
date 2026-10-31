import { AdditionalTreeAnimation } from '../../../../../visualization/AdditionalTreeAnimation.ts'
import type { AdditionalTreeModel, TreeInputValues } from '../../../../../visualization/AdditionalTreeModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { TrieLayout } from '../TrieLayout.ts'

export class StartsWithAnimation extends AdditionalTreeAnimation {
  public static readonly title = 'Check a prefix'
  public static readonly summary = 'Check whether a character path exists, even without a word-end marker.'

  public static describe(size: number, storage = size, runs = 0): AlgorithmInformation {
    return {
      name: this.title,
      summary: this.summary,
      time: { best: 'O(1)', average: 'O(L)', worst: 'O(L)', explanation: 'A first-letter miss stops immediately. Average assumes uniformly distributed failure depths; a matching prefix reads L letters.' },
      memory: { best: 'O(1)', average: 'O(1)', worst: 'O(1)', explanation: 'Traversal uses one node reference. Animation snapshots and traces are excluded.' },
      terms: [
        { symbol: 'L', meaning: 'Number of letters in the requested word or prefix.' },
        { symbol: 'O(1)', meaning: 'Constant work or additional storage.' },
        { symbol: 'O(L)', meaning: 'Work or newly allocated prefix nodes proportional to the requested word length.' },
      ],
    }
  }

  constructor(model: AdditionalTreeModel, input: TreeInputValues = {}) {
    super(model, new TrieLayout(), 'starts-with', input, StartsWithAnimation.title, StartsWithAnimation.summary)
  }
}
