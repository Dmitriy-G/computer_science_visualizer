import { BPlusTree } from '../BPlusTree.ts'
import { BPlusTreeLayout } from '../BPlusTreeLayout.ts'
import { TreeActionAnimation } from '../../../../../visualization/TreeActionAnimation.ts'
import { AnimationSequence } from '../../../../../visualization/AnimationSequence.ts'

export class DeletionAnimation extends TreeActionAnimation<BPlusTree> {

  public static describe(size: number) {
    return AnimationSequence.information(
      'Delete by value', 'Remove one key and restore the tree rules; missing keys leave the tree unchanged.', size,
      ['O(log n)', 'O(log n)', 'O(log n)'],
      'Every case routes to a leaf through logarithmic height at fixed order 4, including a duplicate or miss. Local splits, borrowing, merging, and separator updates follow that path. Empty inputs are constant-time boundary cases.',
      'O(1)', 'A fixed number of page references and cached parent/minimum fields. Deletion repairs pages in place and does not allocate a replacement tree.',
    )
  }

  constructor(model: BPlusTree, value: number) {
    super(model, new BPlusTreeLayout())
    this.begin('Locate the key before removing it. A miss leaves the tree unchanged.', 'current = root')
    const removed = this.result.deleteValue(value, this)
    this.finish(removed ? 'Deletion complete' : 'Key not found', removed ? `Removed ${value}. The tree now contains ${this.result.length} keys; all tree rules are restored.` : `Key ${value} was not found. No keys, links, or colors changed.`, removed ? 'commit deletion' : 'return notFound')
  }
}
