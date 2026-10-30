import { AVLTree } from '../AVLTree.ts'
import { AVLTreeLayout } from '../AVLTreeLayout.ts'
import { TreeActionAnimation } from '../../../../../visualization/TreeActionAnimation.ts'
import { AnimationSequence } from '../../../../../visualization/AnimationSequence.ts'

export class SearchAnimation extends TreeActionAnimation<AVLTree> {
  public readonly foundId: string | null

  public static describe(size: number) {
    return AnimationSequence.information(
      'Search by key', 'Follow ordered comparisons to a matching key without changing the tree.', size,
      ['O(1)', 'O(log n)', 'O(log n)'],
      'Best O(1): a root match (or root duplicate for insertion). Average and worst O(log n): the tree maintains logarithmic height. Average assumes uniformly distributed matching depths or new keys.',
      'O(1)', 'Iterative search uses a fixed number of references and never changes the tree.',
      [
        { symbol: 'h', meaning: 'Cached subtree height: 1 for a leaf and 0 for a missing child.' },
        { symbol: 'balance', meaning: 'Left subtree height minus right subtree height; valid values after repair are -1, 0, and 1.' },
      ],
    )
  }

  constructor(model: AVLTree, value: number) {
    super(model, new AVLTreeLayout())
    this.begin('Follow the ordering rules from the root. Search does not change keys, links, or balance.', 'current = root')
    const found = this.result.find(value, this)
    this.foundId = found?.id ?? null
    this.finish(found ? 'Key found' : 'Key not found', found ? `Found ${value}. The tree is unchanged.` : `Key ${value} was not found. The tree is unchanged.`, found ? 'return match' : 'return notFound', this.foundId, 'FOUND')
  }
}
