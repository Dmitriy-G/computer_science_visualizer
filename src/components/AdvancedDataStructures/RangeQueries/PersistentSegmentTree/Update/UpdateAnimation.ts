import { ExtendedTreeAnimation } from '../../../../../visualization/ExtendedTreeAnimation.ts'
import type { AdditionalTreeModel, TreeInputValues } from '../../../../../visualization/AdditionalTreeModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { PersistentSegmentTreeLayout } from '../PersistentSegmentTreeLayout.ts'
export class UpdateAnimation extends ExtendedTreeAnimation {
  public static readonly title = 'Update a value'
  public static readonly summary = 'Assign a value at a zero-based index and update the affected path.'
  public static describe(size: number): AlgorithmInformation {
    return {
      name: this.title, summary: this.summary,
      time: { best: 'O(log n)', average: 'O(log n)', worst: 'O(log n)', explanation: 'Update copies one balanced root-to-leaf path and shares untouched immutable nodes; range sum visits covered segments along two boundary paths. Full-cover queries use the root sum immediately. Average query assumes uniformly chosen valid intervals. Integer arithmetic also depends on sum digit length.' },
      memory: { best: 'O(log n)', average: 'O(log n)', worst: 'O(log n)', explanation: 'Storage includes the explicit traversal stack and returned output, where applicable. Playback clones and scene snapshots are excluded.' },
      terms: [
        { symbol: 'n', meaning: `Original element count for this run: n = ${size}.` },
        { symbol: 'O(log n)', meaning: 'Work or storage proportional to balanced tree height.' },
      ],
    }
  }
  constructor(model: AdditionalTreeModel, input: TreeInputValues = {}) {
    super(model, new PersistentSegmentTreeLayout(), 'update-index', input, UpdateAnimation.title, UpdateAnimation.summary)
  }
}
