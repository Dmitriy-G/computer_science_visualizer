import { BTree } from '../BTree.ts'
import { BTreeLayout } from '../BTreeLayout.ts'
import { TreeActionAnimation } from '../../../../../visualization/TreeActionAnimation.ts'
import { AnimationSequence } from '../../../../../visualization/AnimationSequence.ts'

export class SearchAnimation extends TreeActionAnimation<BTree> {
  public readonly foundId: string | null

  public static describe(size: number) {
    return AnimationSequence.information(
      'Search by key', 'Follow ordered comparisons to a matching key without changing the tree.', size,
      ['O(1)', 'O(log n)', 'O(log n)'],
      'Best O(1): a key matches in the root. Average and worst O(log n): follow separator ranges through logarithmic height. Average assumes uniformly distributed stored keys; a miss reaches a leaf.',
      'O(1)', 'Iterative page descent uses a fixed number of references. Page capacity is fixed at three keys.',
    )
  }

  constructor(model: BTree, value: number) {
    super(model, new BTreeLayout())
    this.begin('Follow the ordering rules from the root. Search does not change keys, links, or balance.', 'current = root')
    const found = this.result.find(value, this)
    this.foundId = found?.id ?? null
    this.finish(found ? 'Key found' : 'Key not found', found ? `Found ${value} at ${this.searchLocation(found.id, value)}.` : `Key ${value} was not found.`, found ? 'return match' : 'return notFound', this.foundId, 'FOUND')
  }
}
