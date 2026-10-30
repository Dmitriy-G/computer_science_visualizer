import { BPlusTree } from '../BPlusTree.ts'
import { BPlusTreeLayout } from '../BPlusTreeLayout.ts'
import { TreeActionAnimation } from '../../../../../visualization/TreeActionAnimation.ts'
import { AnimationSequence } from '../../../../../visualization/AnimationSequence.ts'

export class RangeAnimation extends TreeActionAnimation<BPlusTree> {
  public readonly values: readonly number[]

  public static describe(size: number) {
    return AnimationSequence.information(
      'Range from value', 'Report all leaf records at or above the inclusive minimum by following next-leaf links.', size,
      ['O(log n + k)', 'O(log n + k)', 'O(log n + k)'],
      'Descend once to the first possible leaf, then scan linked leaves to report k records. With the same n and k, all cases are O(log n + k). Empty trees return immediately.',
      'O(k + 1)', 'The output stores k reported records, plus a fixed number of page references. No visited set or traversal stack is needed.',
      [{ symbol: 'k', meaning: 'The number of leaf records reported by this range scan.' }],
    )
  }

  constructor(model: BPlusTree, value: number) {
    super(model, new BPlusTreeLayout())
    this.begin(`Report every record greater than or equal to ${value}. The upper end of this range is unbounded.`, 'leaf = findLeaf(minimum)')
    this.values = this.result.range(value, Number.MAX_SAFE_INTEGER, this)
    this.finish('Range scan complete', this.values.length ? `Reported ${this.values.length} records in ascending order: ${this.values.join(', ')}. The tree is unchanged.` : `No records are at or above ${value}. The tree is unchanged.`, 'return output')
  }
}
