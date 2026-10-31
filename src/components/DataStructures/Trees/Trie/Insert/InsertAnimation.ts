import { AdditionalTreeAnimation } from '../../../../../visualization/AdditionalTreeAnimation.ts'
import type { AdditionalTreeModel, TreeInputValues } from '../../../../../visualization/AdditionalTreeModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { TrieLayout } from '../TrieLayout.ts'

export class InsertAnimation extends AdditionalTreeAnimation {
  public static readonly title = 'Insert a word'
  public static readonly summary = 'Follow shared prefixes, create missing nodes, and mark the word end.'

  public static describe(size: number, storage = size, runs = 0): AlgorithmInformation {
    return {
      name: this.title,
      summary: this.summary,
      time: { best: 'O(L)', average: 'O(L)', worst: 'O(L)', explanation: 'Every insertion reads all L letters, including duplicates.' },
      memory: { best: 'O(1)', average: 'O(L)', worst: 'O(L)', explanation: 'Duplicates allocate nothing; average assumes a new suffix proportional to L; at most L new nodes are allocated. Animation snapshots and traces are excluded.' },
      terms: [
        { symbol: 'L', meaning: 'Number of letters in the requested word or prefix.' },
        { symbol: 'O(L)', meaning: 'Work or newly allocated prefix nodes proportional to the requested word length.' },
        { symbol: 'O(1)', meaning: 'Constant work or additional storage.' },
      ],
    }
  }

  constructor(model: AdditionalTreeModel, input: TreeInputValues = {}) {
    super(model, new TrieLayout(), 'insert', input, InsertAnimation.title, InsertAnimation.summary)
  }
}
