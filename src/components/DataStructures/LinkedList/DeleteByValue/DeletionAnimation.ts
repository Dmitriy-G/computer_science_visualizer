import { LinkedList } from '../LinkedList.ts'
import { LinkedListLayout } from '../LinkedListLayout.ts'
import { SearchAnimation } from '../SearchByValue/SearchAnimation.ts'
import { AnimationSequence } from '../../../../visualization/AnimationSequence.ts'

export class DeletionAnimation extends AnimationSequence {
  public readonly result: LinkedList

  public static describe(size: number) {
    return AnimationSequence.information(
      'Delete by value',
      'Find and unlink the first matching node.',
      size,
      ['O(1)', 'O(n)', 'O(n)'],
      'Best O(1): the head matches. Worst O(n): the match is last or absent. Average O(n) assumes uniformly distributed matching positions. Finding a middle match also takes O(n); unlinking it takes O(1).',
      'O(1)',
      'A few pointers in every case; no replacement nodes.',
    )
  }

  constructor(model: LinkedList, value: number) {
    super()
    const search = new SearchAnimation(model, value)
    this.steps.push(...search.steps.slice(0, -1))
    this.result = model.clone()
    const index = model.findIndex(value)
    const layout = new LinkedListLayout()
    if (index >= 0) {
      const entries = model.getEntries()
      const target = entries[index]
      const successor = entries[index + 1]
      const predecessor = entries[index - 1]
      const scene = AnimationSequence.mark(layout.create(entries), target.id, [], 'REMOVE')
      const edges = []
      for (const edge of scene.edges) {
        edges.push({ ...edge, opacity: edge.from === target.id || edge.to === target.id ? 0 : edge.opacity })
      }
      if (predecessor && successor) edges.push({ id: `${predecessor.id}-${successor.id}`, from: predecessor.id, to: successor.id, directed: true, highlighted: true, opacity: 1 })
      const bypassed = { ...scene, edges }
      const description = predecessor
        ? 'Save the successor, then point the previous node to that successor.'
        : successor
          ? `Set head to the saved successor, ${successor.value}.`
          : 'The matching node is the only node. Set head to null.'
      this.add(4, 'Bypass the matching node', description, predecessor ? 'previous.next = current.next' : 'head = current.next', bypassed)
      const nodes = []
      for (const node of bypassed.nodes) nodes.push({ ...node, opacity: node.id === target.id ? 0 : 1 })
      this.add(5, 'Release the removed node', 'The remaining nodes are connected. Fade out the detached node before closing the visual gap.', 'release(current)', { ...bypassed, nodes, focusId: successor?.id ?? predecessor?.id ?? null })
      this.result.deleteAt(index)
    }
    this.add(6, index < 0 ? 'Value not found; list unchanged' : 'Deletion complete', index < 0 ? `Value ${value} was not found. The list still has ${model.length} nodes.` : `Removed ${value} at index ${index}. The list now has ${this.result.length} nodes; later duplicates remain.`, index < 0 ? 'return notFound' : 'size -= 1', layout.create(this.result.getEntries()))
  }
}
