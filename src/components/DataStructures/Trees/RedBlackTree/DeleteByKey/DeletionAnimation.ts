import { RedBlackTree } from '../RedBlackTree.ts'
import { RedBlackTreeLayout } from '../RedBlackTreeLayout.ts'
import { TreeActionAnimation } from '../../../../../visualization/TreeActionAnimation.ts'
import { AnimationSequence } from '../../../../../visualization/AnimationSequence.ts'

export class DeletionAnimation extends TreeActionAnimation<RedBlackTree> {

  public static describe(size: number) {
    return AnimationSequence.information(
      'Delete a key', 'Remove one key and restore the tree rules; missing keys leave the tree unchanged.', size,
      ['O(1)', 'O(log n)', 'O(log n)'],
      'Best O(1): a root match (or root duplicate for insertion). Average and worst O(log n): the tree maintains logarithmic height. Average assumes uniformly distributed matching depths or new keys.',
      'O(1)', 'Cached parent links let deletion reconnect nodes and repair balance with a fixed number of references.',
    )
  }

  constructor(model: RedBlackTree, value: number) {
    super(model, new RedBlackTreeLayout())
    this.begin('Locate the key before removing it. A miss leaves the tree unchanged.', 'current = root')
    const removed = this.result.deleteValue(value, this)
    this.finish(removed ? 'Deletion complete' : 'Key not found', removed ? `Removed ${value}. The tree now contains ${this.result.length} keys; all tree rules are restored.` : `Key ${value} was not found. No keys, links, or colors changed.`, removed ? 'commit deletion' : 'return notFound')
  }
}
