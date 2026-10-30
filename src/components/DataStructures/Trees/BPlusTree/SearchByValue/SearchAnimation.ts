import { BPlusTree } from '../BPlusTree.ts'
import { BPlusTreeLayout } from '../BPlusTreeLayout.ts'
import { TreeActionAnimation } from '../../../../../visualization/TreeActionAnimation.ts'
import { AnimationSequence } from '../../../../../visualization/AnimationSequence.ts'

export class SearchAnimation extends TreeActionAnimation<BPlusTree> {
  public readonly foundId: string | null

  public static describe(size: number) {
    return AnimationSequence.information(
      'Search by value', 'Follow ordered comparisons to a matching key without changing the tree.', size,
      ['O(log n)', 'O(log n)', 'O(log n)'],
      'Every case routes to a leaf through logarithmic height at fixed order 4, including a duplicate or miss. Local splits, borrowing, merging, and separator updates follow that path. Empty inputs are constant-time boundary cases.',
      'O(1)', 'A fixed number of page references and cached parent/minimum fields. Deletion repairs pages in place and does not allocate a replacement tree.',
    )
  }

  constructor(model: BPlusTree, value: number) {
    super(model, new BPlusTreeLayout())
    this.begin('Follow the ordering rules from the root. Search does not change keys, links, or balance.', 'current = root')
    const found = this.result.find(value, this)
    this.foundId = found?.id ?? null
    this.finish(found ? 'Key found' : 'Key not found', found ? `Found ${value}. The tree is unchanged.` : `Key ${value} was not found. The tree is unchanged.`, found ? 'return match' : 'return notFound', this.foundId, 'FOUND')
  }
}
