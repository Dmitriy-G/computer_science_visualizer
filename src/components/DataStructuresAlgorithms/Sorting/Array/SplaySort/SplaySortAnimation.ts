import { ArraySortingAnimation } from '../ArraySortingAnimation.ts'
import { FixedArray } from '../../../../FundamentalDataStructures/Linear/Array/FixedArray.ts'

export class SplaySortAnimation extends ArraySortingAnimation {
  public static describe(size: number) {
    return this.information('Splay Sort', 'Insert entries into a splay tree, rotate each insertion to the root, and read the tree in order.', size,
      ['O(n)', 'O(n log n)', 'O(n log n)'],
      'Monotone insertion order uses O(n) total tree work, followed by linear inorder traversal. Amortized splay-tree insertion bounds total average and worst work by O(n log n); these bounds do not require a random-input assumption. A single insertion may still be linear. Empty and singleton inputs take O(1).',
      'O(n)', 'One auxiliary tree node and one output reference per entry use O(n) space. Iterative rotations and parent-link inorder traversal avoid recursive tree stacks. New equal keys descend right, and rotations preserve inorder order, making this variant stable.')
  }

  constructor(model: FixedArray) {
    super(model, 'Splay Sort', { counterHint: 'Splay each insertion to the root using zig, zig-zig, and zig-zag rotations.' })
    this.result.splaySort((event) => this.recordTrace(event))
    this.finish(true)
    this.fitScenes()
  }
}
