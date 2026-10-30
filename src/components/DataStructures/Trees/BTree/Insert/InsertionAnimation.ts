import { BTree } from '../BTree.ts'
import { BTreeLayout } from '../BTreeLayout.ts'
import { TreeActionAnimation } from '../../../../../visualization/TreeActionAnimation.ts'
import { AnimationSequence } from '../../../../../visualization/AnimationSequence.ts'

export class InsertionAnimation extends TreeActionAnimation<BTree> {

  public static describe(size: number) {
    return AnimationSequence.information(
      'Insert a key', 'Insert one unique key, then restore the tree rules.', size,
      ['O(1)', 'O(log n)', 'O(log n)'],
      'Best O(1): a root match (or root duplicate for insertion). Average and worst O(log n): the tree maintains logarithmic height. Average assumes uniformly distributed matching depths or new keys.',
      ['O(1)', 'O(1)', 'O(log n)'], 'New split pages are output storage. Best O(1): no split; worst O(log n): splits reach the root. Average O(1) is amortized over an insertion-only sequence of unique keys. Parent links or iterative descent avoid a separate ancestor stack.',
    )
  }

  constructor(model: BTree, value: number) {
    super(model, new BTreeLayout())
    this.begin('Insert a unique integer key. Existing equal keys are left unchanged.', 'current = root')
    const inserted = this.result.insert(value, this)
    this.finish(inserted ? 'Insertion complete' : 'Key already exists', inserted ? `Inserted ${value}. The tree now contains ${this.result.length} keys; all tree rules are restored.` : `Key ${value} already exists. The tree and its count are unchanged.`, inserted ? 'commit insertion' : 'return duplicate')
  }
}
