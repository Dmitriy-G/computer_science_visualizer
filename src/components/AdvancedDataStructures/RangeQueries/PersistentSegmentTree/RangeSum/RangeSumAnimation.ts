import { ExtendedTreeAnimation } from '../../../../../visualization/ExtendedTreeAnimation.ts'
import type { AdditionalTreeModel, TreeInputValues } from '../../../../../visualization/AdditionalTreeModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { PersistentSegmentTreeLayout } from '../PersistentSegmentTreeLayout.ts'
export class RangeSumAnimation extends ExtendedTreeAnimation {
  public static readonly title = 'Range sum in a version'
  public static readonly summary = 'Read an exact inclusive range sum from the selected immutable version.'
  public static describe(size: number): AlgorithmInformation {
    return {
      name: this.title, summary: this.summary,
      time: { best: 'O(1)', average: 'O(log n)', worst: 'O(log n)', explanation: 'Update copies one balanced root-to-leaf path and shares untouched immutable nodes; range sum visits covered segments along two boundary paths. Full-cover queries use the root sum immediately. Average query assumes uniformly chosen valid intervals. Integer arithmetic also depends on sum digit length.' },
      memory: { best: 'O(1)', average: 'O(log n)', worst: 'O(log n)', explanation: 'Storage includes the explicit traversal stack and returned output, where applicable. Playback clones and scene snapshots are excluded.' },
      terms: [
        { symbol: 'n', meaning: `Original element count for this run: n = ${size}.` },
        { symbol: 'O(1)', meaning: 'Constant work or additional storage.' },
        { symbol: 'O(log n)', meaning: 'Work or storage proportional to balanced tree height.' },
      ],
    }
  }
  constructor(model: AdditionalTreeModel, input: TreeInputValues = {}) {
    super(model, new PersistentSegmentTreeLayout(), 'range-sum', input, RangeSumAnimation.title, RangeSumAnimation.summary)
  }
}
