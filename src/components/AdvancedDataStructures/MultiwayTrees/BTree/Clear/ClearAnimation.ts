import { BTree } from '../BTree.ts'
import { BTreeLayout } from '../BTreeLayout.ts'
import { TreeActionAnimation } from '../../../../../visualization/TreeActionAnimation.ts'
import { AnimationSequence } from '../../../../../visualization/AnimationSequence.ts'

export class ClearAnimation extends TreeActionAnimation<BTree> {

  public static describe(size: number) {
    return AnimationSequence.information(
      'Clear', 'Release all nodes or pages after their children, without repeated balanced deletions.', size,
      ['O(n)', 'O(n)', 'O(n)'],
      'For the same nonempty input size, every case releases every node or page. Fixed page capacity makes page count proportional to record count. Empty inputs return immediately.',
      'O(log n)', 'An explicit postorder stack follows a logarithmic-height balanced tree. Clear skips per-key rotations, recoloring, and occupancy repair.',
    )
  }

  constructor(model: BTree) {
    super(model, new BTreeLayout(), true)
    this.begin('Release children before their parent. Clear discards the complete tree rather than repairing after every individual deletion.', 'start postorder traversal')
    this.result.clear(this)
    this.finish('Clear complete', model.length ? 'All keys and pages or nodes have been released. The root is empty.' : 'The tree was already empty. The root remains empty.', 'root = null\ncount = 0')
  }
}
