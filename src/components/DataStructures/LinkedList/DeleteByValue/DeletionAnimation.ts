import { LinkedList } from '../LinkedList.ts'
import { LinkedListLayout } from '../LinkedListLayout.ts'
import { SearchAnimation } from '../SearchByValue/SearchAnimation.ts'
import { AnimationSequence } from '../../../../visualization/AnimationSequence.ts'

export class DeletionAnimation extends AnimationSequence {
  public readonly result: LinkedList

  public static describe(size: number) {
    return AnimationSequence.information('Delete by value', 'Find the first match, bypass it, and release the removed node.', size,
      ['O(1)', 'O(n)', 'O(n)'], 'Removing the head is constant time. Finding a later match or proving absence needs traversal from the head.', 'O(1)', 'The iterative algorithm keeps only current, previous, and successor references.')
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
      const bypassed = AnimationSequence.message({ ...scene, edges }, predecessor ? 'Previous node now points to the saved successor' : successor ? `Head now points to ${successor.value}` : 'Head is now null')
      this.add(4, 'Bypass the matching node', 'Save the successor, then update the predecessor pointer or the head pointer.', predecessor ? 'previous.next = current.next' : 'head = current.next', bypassed)
      const nodes = []
      for (const node of bypassed.nodes) nodes.push({ ...node, opacity: node.id === target.id ? 0 : 1 })
      this.add(5, 'Release the removed node', 'The remaining nodes are connected. Fade out the detached node before closing the visual gap.', 'release(current)', { ...bypassed, nodes, focusId: successor?.id ?? predecessor?.id ?? null })
      this.result.deleteAt(index)
    }
    this.add(6, index < 0 ? 'Value not found; list unchanged' : 'Deletion complete', `The list has ${this.result.length} nodes. Only the first match is removed.`, index < 0 ? 'return notFound' : 'size -= 1', AnimationSequence.message(layout.create(this.result.getEntries()), index < 0 ? `Value ${value} was not found` : `Removed ${value} at index ${index}`))
  }
}
