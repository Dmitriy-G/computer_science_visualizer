import { BinaryTree } from '../BinaryTree.ts'
import { BinaryTreeLayout } from '../BinaryTreeLayout.ts'
import { SearchAnimation } from '../SearchByValue/SearchAnimation.ts'
import { AnimationSequence } from '../../../../../visualization/AnimationSequence.ts'

export class DeletionAnimation extends AnimationSequence {
  public readonly result: BinaryTree

  public static describe(size: number) {
    return AnimationSequence.information(
      'Delete by value',
      'Remove the first match, preserving search ordering.',
      size,
      ['O(1)', 'O(log n)', 'O(n)'],
      'O(h). Best O(1): the root matches and has at most one child. Average O(log n) assumes distinct keys inserted in random order. Worst O(n): a long search or successor path in an unbalanced chain.',
      'O(1)',
      'A few pointers in every case; no replacement nodes or recursion stack.',
      [
        { symbol: 'h', meaning: 'The number of nodes on the longest root-to-leaf path; 0 for an empty tree.' },
        { symbol: 'O(h)', meaning: 'Traversal work is bounded by the tree height.' },
      ],
    )
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
    this.add(6, target ? 'Deletion complete' : 'Value not found; tree unchanged', target ? `Removed the first equal node on the search path for ${value}. The tree now has ${this.result.length} nodes; later duplicates remain.` : `Value ${value} was not found. The tree still has ${model.length} nodes.`, target ? 'size -= 1' : 'return notFound', layout.create(this.result.getEntries()))
  }
}
