import { BTree } from '../BTree.ts'
import { BTreeLayout } from '../BTreeLayout.ts'
import { TreeActionAnimation } from '../../../../../visualization/TreeActionAnimation.ts'
import { AnimationSequence } from '../../../../../visualization/AnimationSequence.ts'

export class DeletionAnimation extends TreeActionAnimation<BTree> {

  public static describe(size: number) {
    return AnimationSequence.information(
      'Delete by value', 'Remove one key and restore the tree rules; missing keys leave the tree unchanged.', size,
      ['O(log n)', 'O(log n)', 'O(log n)'],
      'At fixed page capacity, a nonempty search descends logarithmic height. Successful deletion also reaches a leaf and may borrow or merge on that path. Empty inputs return immediately.',
      ['O(1)', 'O(log n)', 'O(log n)'], 'A miss uses constant iterative-search space. Successful deletion uses an O(log n) recursion stack. Average assumes a constant probability of successful deletion.',
    )
  }

  constructor(model: BTree, value: number) {
    super(model, new BTreeLayout())
    this.begin('Locate the key before removing it. A miss leaves the tree unchanged.', 'current = root')
    const removed = this.result.deleteValue(value, this)
    this.finish(removed ? 'Deletion complete' : 'Key not found', removed ? `Removed ${value}. The tree now contains ${this.result.length} keys; all tree rules are restored.` : `Key ${value} was not found. No keys, links, or colors changed.`, removed ? 'commit deletion' : 'return notFound')
  }
}
