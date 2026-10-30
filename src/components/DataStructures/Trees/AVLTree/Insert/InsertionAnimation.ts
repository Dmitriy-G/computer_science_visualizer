import { AVLTree } from '../AVLTree.ts'
import { AVLTreeLayout } from '../AVLTreeLayout.ts'
import { TreeActionAnimation } from '../../../../../visualization/TreeActionAnimation.ts'
import { AnimationSequence } from '../../../../../visualization/AnimationSequence.ts'

export class InsertionAnimation extends TreeActionAnimation<AVLTree> {

  public static describe(size: number) {
    return AnimationSequence.information(
      'Insert a key', 'Insert one unique key, then restore the tree rules.', size,
      ['O(1)', 'O(log n)', 'O(log n)'],
      'Best O(1): a root match (or root duplicate for insertion). Average and worst O(log n): the tree maintains logarithmic height. Average assumes uniformly distributed matching depths or new keys.',
      'O(1)', 'A fixed number of pointers and cached parent links; insertion allocates one node. No recursion stack is needed.',
      [
        { symbol: 'h', meaning: 'Cached subtree height: 1 for a leaf and 0 for a missing child.' },
        { symbol: 'balance', meaning: 'Left subtree height minus right subtree height; valid values after repair are -1, 0, and 1.' },
      ],
    )
  }

  constructor(model: AVLTree, value: number) {
    super(model, new AVLTreeLayout())
    this.begin('Insert a unique integer key. Existing equal keys are left unchanged.', 'current = root')
    const inserted = this.result.insert(value, this)
    this.finish(inserted ? 'Insertion complete' : 'Key already exists', inserted ? `Inserted ${value}. The tree now contains ${this.result.length} keys; all tree rules are restored.` : `Key ${value} already exists. The tree and its count are unchanged.`, inserted ? 'commit insertion' : 'return duplicate')
  }
}
