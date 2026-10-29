import { BinaryTree } from '../BinaryTree.ts'
import { BinaryTreeLayout } from '../BinaryTreeLayout.ts'
import { AnimationSequence } from '../../../../visualization/AnimationSequence.ts'

export class SearchAnimation extends AnimationSequence {
  public readonly result: BinaryTree
  public readonly foundId: string | null

  public static describe(size: number) {
    return AnimationSequence.information('Search by value', 'Compare along the ordered search path.', size, ['O(1)', 'O(log n)', 'O(n)'], 'The root may match immediately. Average time assumes distinct keys inserted in random order; an unbalanced chain takes linear time.', 'O(1)', 'The iterative algorithm keeps a fixed number of references and counters.')
  }

  constructor(model: BinaryTree, value: number) {
    super()
    this.result = model.clone()
    if (!Number.isSafeInteger(value)) throw new TypeError('Values must be safe integers')
    const path = model.getSearchPath(value)
    const scene = new BinaryTreeLayout().create(model.getEntries())
    this.add(1, 'Start the search', 'Compare along the ordered search path.', 'current = start', scene)
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
    const message = success ? `Found ${value}${''}` : `Value ${value} was not found`
    const resultScene = AnimationSequence.mark(scene, this.foundId, visited, 'FOUND')
    this.add(3, success ? 'Element found' : 'No matching element', message, success ? 'return current' : 'return notFound', resultScene)
    this.add(4, 'Search complete', 'Search leaves the structure unchanged.', '// no mutation', resultScene)
  }
}
