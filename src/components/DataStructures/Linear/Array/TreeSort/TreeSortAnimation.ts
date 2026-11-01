import { ArraySortingAnimation } from '../ArraySortingAnimation.ts'
import { FixedArray } from '../FixedArray.ts'

export class TreeSortAnimation extends ArraySortingAnimation {
  public static describe(size: number) {
    return this.information('Tree Sort', 'Insert every entry into an unbalanced binary search tree, then write its inorder traversal back to the array.', size,
      ['O(n log n)', 'O(n log n)', 'O(n²)'],
      'Balanced insertion orders give O(n log n) best time. Average assumes a uniformly random permutation of distinct keys. Sorted, reverse-sorted, or all-equal input creates a chain and takes O(n²). Inorder output is linear. Empty and singleton inputs take O(1).',
      'O(n)', 'One auxiliary BST node per entry stores child and parent links. Parent links allow iterative inorder traversal without an additional stack. Equal keys descend right, making this particular Tree Sort implementation stable.')
  }

  constructor(model: FixedArray) {
    super(model, 'Tree Sort')
    this.result.treeSort((event) => this.recordTrace(event))
    this.finish(true)
    this.fitScenes()
  }
}
