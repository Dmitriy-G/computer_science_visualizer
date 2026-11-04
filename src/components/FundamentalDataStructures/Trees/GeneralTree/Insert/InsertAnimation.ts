import { ExtendedTreeAnimation } from '../../../../../visualization/ExtendedTreeAnimation.ts'
import type { AdditionalTreeModel, TreeInputValues } from '../../../../../visualization/AdditionalTreeModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { GeneralTreeLayout } from '../GeneralTreeLayout.ts'
export class InsertAnimation extends ExtendedTreeAnimation {
  public static readonly title = 'Attach a child'
  public static readonly summary = 'Attach a unique key below an existing parent; the first insertion creates the root.'
  public static describe(size: number): AlgorithmInformation {
    return {
      name: this.title, summary: this.summary,
      time: { best: 'O(1)', average: 'O(n)', worst: 'O(n)', explanation: 'There is no key ordering. DFS finds the target or parent in O(n); subtree deletion also visits or counts descendants. Average O(n) assumes uniformly distributed matching positions; a root match can be constant.' },
      memory: { best: 'O(1)', average: 'O(n)', worst: 'O(n)', explanation: 'Storage includes the explicit traversal stack and returned output, where applicable. Playback clones and scene snapshots are excluded.' },
      terms: [
        { symbol: 'n', meaning: `Original element count for this run: n = ${size}.` },
        { symbol: 'O(1)', meaning: 'Constant work or additional storage.' },
        { symbol: 'O(n)', meaning: 'Linear work or additional storage.' },
      ],
    }
  }
  constructor(model: AdditionalTreeModel, input: TreeInputValues = {}) {
    super(model, new GeneralTreeLayout(), 'insert', input, InsertAnimation.title, InsertAnimation.summary)
  }
}
