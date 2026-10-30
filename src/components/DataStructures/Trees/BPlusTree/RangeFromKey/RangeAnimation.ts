import { BPlusTree } from '../BPlusTree.ts'
import { BPlusTreeLayout } from '../BPlusTreeLayout.ts'
import { TreeActionAnimation } from '../../../../../visualization/TreeActionAnimation.ts'
import { AnimationSequence } from '../../../../../visualization/AnimationSequence.ts'

export class RangeAnimation extends TreeActionAnimation<BPlusTree> {
  public readonly values: readonly number[]

  public static describe(size: number) {
    return AnimationSequence.information(
      'Range from key', 'Report all leaf records between two inclusive keys by following next-leaf links.', size,
      ['O(log n + k)', 'O(log n + k)', 'O(log n + k)'],
      'Descend once to the first possible leaf, then scan linked leaves to report k records. With the same n and k, all cases are O(log n + k). Empty trees return immediately.',
      'O(k + 1)', 'The output stores k reported records, plus a fixed number of page references. No visited set or traversal stack is needed.',
      [{ symbol: 'k', meaning: 'The number of leaf records reported by this range scan.' }],
    )
  }

  constructor(model: BPlusTree, minimum: number, maximum = Number.MAX_SAFE_INTEGER) {
    super(model, new BPlusTreeLayout())
    this.begin(`Report every record from ${minimum} to ${maximum}, including both boundary keys.`, 'leaf = findLeaf(minimum)\nscan while key <= maximum')
    this.values = this.result.range(minimum, maximum, this)
    this.finish('Range scan complete', this.values.length ? `Reported ${this.values.length} records from ${minimum} to ${maximum} in ascending order: ${this.values.join(', ')}. The tree is unchanged.` : `No records are between ${minimum} and ${maximum}, inclusive. The tree is unchanged.`, 'return output')
  }
}
