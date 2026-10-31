import { BinaryTree } from '../BinaryTree.ts'
import { BinaryTreeLayout } from '../BinaryTreeLayout.ts'
import { AnimationSequence } from '../../../../../visualization/AnimationSequence.ts'

export class SearchAnimation extends AnimationSequence {
  public readonly result: BinaryTree
  public readonly foundId: string | null

  public static describe(size: number) {
    return AnimationSequence.information(
      'Search by key',
      'Compare from the root and follow the ordered branch.',
      size,
      ['O(1)', 'O(log n)', 'O(n)'],
      'O(h). Best O(1): the root matches. Average O(log n) assumes distinct keys inserted in random order. Worst O(n): reaching the end of an unbalanced chain.',
      'O(1)',
      'A current-node pointer and target value; no recursion stack.',
      [
        { symbol: 'h', meaning: 'The number of nodes on the longest root-to-leaf path; 0 for an empty tree.' },
        { symbol: 'O(h)', meaning: 'Traversal work is bounded by the tree height.' },
      ],
    )
  }

  constructor(model: BinaryTree, value: number) {
    super()
    this.result = model.clone()
    if (!Number.isSafeInteger(value)) throw new TypeError('Values must be safe integers')
    const path = model.getSearchPath(value)
    const scene = new BinaryTreeLayout().create(model.getEntries())
    this.add(1, 'Start the search', 'Start at the root and follow the binary search ordering.', 'current = root', scene)
    const visited: string[] = []
    for (let index = 0; index < path.length; index += 1) {
      const entry = path[index]
      this.add(2, `Compare ${value} with ${entry.value}`, 'Compare at the current node. If unequal, take the left child for a smaller value and the right child for a larger value.', `if (${value} === ${entry.value}) return current`, AnimationSequence.mark(scene, entry.id, visited))
      visited.push(entry.id)
      if (index + 1 < path.length) {
        this.add(2, 'Follow the search path', 'Move to the next candidate without changing the structure.', `current = ${value < entry.value ? 'current.left' : 'current.right'}`, AnimationSequence.mark(scene, path[index + 1].id, visited))
      }
    }
    const last = path[path.length - 1]
    const success = last !== undefined && last.value === value
    this.foundId = success ? last.id : null
    const message = success ? `Found ${value} at depth ${path.length - 1} (root depth is 0)` : `Value ${value} was not found`
    const resultScene = AnimationSequence.mark(scene, this.foundId, visited, 'FOUND')
    this.add(3, success ? 'Element found' : 'No matching element', message, success ? 'return current' : 'return notFound', resultScene)
  }
}
