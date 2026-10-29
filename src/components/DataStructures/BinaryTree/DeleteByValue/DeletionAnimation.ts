import { BinaryTree } from '../BinaryTree.ts'
import { BinaryTreeLayout } from '../BinaryTreeLayout.ts'
import { SearchAnimation } from '../SearchByValue/SearchAnimation.ts'
import { AnimationSequence } from '../../../../visualization/AnimationSequence.ts'

export class DeletionAnimation extends AnimationSequence {
  public readonly result: BinaryTree

  public static describe(size: number) {
    return AnimationSequence.information('Delete by value', 'Find the first equal node and reconnect the tree while preserving search ordering.', size,
      ['O(1)', 'O(log n)', 'O(n)'], 'A root with at most one child takes constant time. Search and successor traversal follow the tree height. Average time assumes distinct keys inserted in random order; an unbalanced tree can be a linear chain.', 'O(1)', 'Iterative search and successor replacement use a fixed number of pointers. Move the successor node itself to preserve stable IDs.')
  }

  constructor(model: BinaryTree, value: number) {
    super()
    const search = new SearchAnimation(model, value)
    this.steps.push(...search.steps.slice(0, -1))
    this.result = model.clone()
    const entries = model.getEntries()
    const layout = new BinaryTreeLayout()
    const target = entries.find((entry) => entry.id === search.foundId)
    if (target) {
      const scene = AnimationSequence.mark(layout.create(entries), target.id, [], 'REMOVE')
      if (target.leftId !== null && target.rightId !== null) {
        const byId = new Map()
        for (const entry of entries) byId.set(entry.id, entry)
        let successor = byId.get(target.rightId)!
        let successorParent = target
        while (true) {
          this.add(4, `Inspect successor candidate ${successor.value}`, 'For two children, find the leftmost node of the right subtree. It can replace the target without breaking ordering.', 'successor = minimum(current.right)', AnimationSequence.mark(scene, successor.id, [target.id], 'SUCCESSOR'))
          if (successor.leftId === null) break
          successorParent = successor
          successor = byId.get(successor.leftId)!
        }
        const edges = []
        for (const edge of scene.edges) edges.push({ ...edge, opacity: edge.from === successorParent.id && edge.to === successor.id ? 0 : edge.opacity })
        if (successorParent.id !== target.id && successor.rightId !== null)
          edges.push({ id: `${successorParent.id}-${successor.rightId}`, from: successorParent.id, to: successor.rightId, directed: true, highlighted: true, opacity: 1 })
        this.add(4, 'Detach the successor', 'Replace the successor at its old position with its right child, if present. Keep references to both target subtrees.', successorParent.id === target.id ? 'replacement = current.right' : 'successorParent.left = successor.right', AnimationSequence.mark({ ...scene, edges }, successor.id, [target.id], 'SUCCESSOR'))
      } else {
        this.add(4, 'Choose the replacement', target.leftId || target.rightId ? 'Promote the only child into the target position.' : 'A leaf has no children; replace its incoming pointer with null.', 'replacement = current.left ?? current.right', scene)
      }
      this.result.deleteValue(value)
      const rewired = layout.create(this.result.getEntries())
      this.add(5, 'Reconnect the replacement', 'Update the parent pointer, or root. Preserve all surviving node IDs and values.', 'parent.child = replacement  // or root = replacement', { ...rewired, count: model.length })
    }
    this.add(6, target ? 'Deletion complete' : 'Value not found; tree unchanged', `The tree has ${this.result.length} nodes. Duplicates are separate nodes; remove only the first equal node on the search path.`, target ? 'size -= 1' : 'return notFound', AnimationSequence.message(layout.create(this.result.getEntries()), target ? `Removed ${value}` : `Value ${value} was not found`))
  }
}
