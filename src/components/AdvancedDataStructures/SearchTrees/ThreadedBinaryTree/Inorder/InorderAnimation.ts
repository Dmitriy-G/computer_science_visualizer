import { ExtendedTreeAnimation } from '../../../../../visualization/ExtendedTreeAnimation.ts'
import type { AdditionalTreeModel, TreeInputValues } from '../../../../../visualization/AdditionalTreeModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { ThreadedBinaryTreeLayout } from '../ThreadedBinaryTreeLayout.ts'
export class InorderAnimation extends ExtendedTreeAnimation {
  public static readonly title = 'Traverse inorder'
  public static readonly summary = 'Visit sorted keys through predecessor/successor threads, without a traversal stack.'
  public static describe(size: number): AlgorithmInformation {
    return {
      name: this.title, summary: this.summary,
      time: { best: 'O(n)', average: 'O(n)', worst: 'O(n)', explanation: 'Visit every key in inorder using thread flags and successor pointers. Every child link is descended at most once and every successor transition at most once.' },
      memory: { best: 'O(n)', average: 'O(n)', worst: 'O(n)', explanation: 'Traversal pointers require O(1); returning all n keys requires O(n) output. Playback snapshots are excluded.' },
      terms: [
        { symbol: 'n', meaning: `Original element count for this run: n = ${size}.` },
        { symbol: 'O(n)', meaning: 'Linear work or additional storage.' },
      ],
    }
  }
  constructor(model: AdditionalTreeModel, input: TreeInputValues = {}) {
    super(model, new ThreadedBinaryTreeLayout(), 'traverse-inorder', input, InorderAnimation.title, InorderAnimation.summary)
  }
}
