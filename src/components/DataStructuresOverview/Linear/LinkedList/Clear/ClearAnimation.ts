import { LinkedList } from '../LinkedList.ts'
import { LinkedListLayout } from '../LinkedListLayout.ts'
import { AnimationSequence } from '../../../../../visualization/AnimationSequence.ts'
import type { Scene, SceneNode, SceneEdge } from '../../../../../visualization/Scene.ts'

export class ClearAnimation extends AnimationSequence {
  public readonly result: LinkedList

  public static describe(size: number) {
    return AnimationSequence.information(
      'Clear', 'Release every linked node from head to tail.', size,
      ['O(n)', 'O(n)', 'O(n)'],
      'Every case visits and releases all n nodes in a nonempty list. Empty inputs return immediately.',
      'O(1)', 'Only the current head and a saved successor are needed.',
    )
  }

  constructor(model: LinkedList) {
    super()
    this.result = model.clone()
    this.result.clear()
    const entries = model.getEntries()
    const layout = new LinkedListLayout()
    const initial = layout.create(entries)
    const released = new Set<string>()
    this.add(1, 'Inspect the head pointer', 'Start at head. Save each successor before disconnecting the current node.', 'current = head', this.createFrame(initial, released, entries[0]?.id ?? null))
    for (let index = 0; index < entries.length; index += 1) {
      const entry = entries[index]
      const next = entries[index + 1]
      this.add(2, `Save the successor of ${entry.value}`, next ? `Keep a reference to ${next.value} before releasing the current head.` : 'This is the last node; the saved successor is null.', 'savedNext = head.next', this.createFrame(initial, released, entry.id))
      const current = this.createFrame(initial, released, entry.id)
      const edges: SceneEdge[] = []
      for (const edge of current.edges) edges.push({ ...edge, opacity: edge.from === entry.id ? 0 : edge.opacity })
      this.add(3, `Disconnect value ${entry.value}`, 'Advance head to the saved successor and detach the old head pointer.', 'head = savedNext\nremoved.next = null', { ...current, edges })
      released.add(entry.id)
      this.add(3, `Release value ${entry.value}`, next ? 'The next surviving node is now head. Continue without moving surviving nodes.' : 'The last node has been released. Head is now null.', 'release removed', this.createFrame(initial, released, next?.id ?? null))
    }
    const final = layout.create(this.result.getEntries())
    this.add(4, 'Clear complete', model.length ? 'All nodes have been released. The list is empty and head is null.' : 'The list was already empty. Head remains null.', 'head = null\nsize = 0', { ...final, slots: [{ id: 'clear-empty-head', x: 88, y: 278, label: 'head = null', empty: true, highlighted: true, opacity: 1 }] })
  }

  private createFrame(original: Scene, released: ReadonlySet<string>, activeId: string | null): Scene {
    const nodes: SceneNode[] = []
    const edges: SceneEdge[] = []
    for (const node of original.nodes) {
      if (released.has(node.id)) continue
      nodes.push({ ...node, label: `${nodes.length === 0 ? 'head / ' : ''}index ${nodes.length}`, tone: node.id === activeId ? 'active' : 'default', status: node.id === activeId ? 'HEAD' : undefined })
    }
    for (const edge of original.edges) {
      if (!released.has(edge.from) && !released.has(edge.to)) edges.push({ ...edge })
    }
    return { ...original, nodes, edges, focusId: activeId }
  }
}
