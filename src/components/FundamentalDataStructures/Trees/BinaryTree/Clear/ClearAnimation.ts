import { BinaryTree } from '../BinaryTree.ts'
import type { BinaryTreeEntry } from '../BinaryTree.ts'
import { BinaryTreeLayout } from '../BinaryTreeLayout.ts'
import { AnimationSequence } from '../../../../../visualization/AnimationSequence.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import type { Scene, SceneNode, SceneEdge } from '../../../../../visualization/Scene.ts'

export class ClearAnimation extends AnimationSequence {
  public readonly result: BinaryTree

  public static describe(size: number): AlgorithmInformation {
    return {
      name: 'Clear',
      summary: 'Release every tree node in left-right-root postorder.',
      time: {
        best: 'O(n)', average: 'O(n)', worst: 'O(n)',
        explanation: 'Every case visits and releases all n nodes. Empty inputs return immediately.',
      },
      memory: {
        best: 'O(log n)', average: 'O(log n)', worst: 'O(n)',
        explanation: 'The iterative traversal uses O(h) stack space: O(log n) for a balanced tree, O(log n) on average for distinct keys inserted in random order, and O(n) for a chain. Empty inputs use O(1). Animation storage excluded.',
      },
      terms: [
        { symbol: 'n', meaning: `Original number of nodes for this run: n = ${size}.` },
        { symbol: 'h', meaning: 'Number of nodes on the longest root-to-leaf path; zero for an empty tree.' },
        { symbol: 'O(n)', meaning: 'Work or storage proportional to the number of nodes.' },
        { symbol: 'O(h)', meaning: 'Stack storage proportional to the tree height.' },
        { symbol: 'O(log n)', meaning: 'Stack storage proportional to the logarithm of the number of nodes.' },
        { symbol: 'O(1)', meaning: 'Constant storage for the empty boundary case.' },
      ],
    }
  }

  constructor(model: BinaryTree) {
    super()
    this.result = model.clone()
    this.result.clear()
    const entries = model.getEntries()
    const byId = new Map<string, BinaryTreeEntry>()
    for (const entry of entries) byId.set(entry.id, entry)
    const layout = new BinaryTreeLayout()
    const initial = layout.create(entries)
    const released = new Set<string>()
    const stack: { id: string; expanded: boolean }[] = []
    if (entries[0]) stack.push({ id: entries[0].id, expanded: false })
    this.add(1, 'Inspect the root', 'Use postorder: clear the left subtree, then the right subtree, then the parent. An empty root needs no traversal.', 'stack = root ? [(root, enter)] : []', this.createFrame(initial, released, entries[0]?.id ?? null, 'ROOT'))
    while (stack.length > 0) {
      const { id, expanded } = stack.pop()!
      const entry = byId.get(id)!
      if (!expanded) {
        this.add(2, `Visit value ${entry.value}`, 'Save this parent on the traversal stack while its children are cleared. Children are always released before their parent.', 'push (node, exit)\npush right child, then left child', this.createFrame(initial, released, id, 'CURRENT'))
        stack.push({ id, expanded: true })
        if (entry.rightId) stack.push({ id: entry.rightId, expanded: false })
        if (entry.leftId) stack.push({ id: entry.leftId, expanded: false })
      } else {
        const current = this.createFrame(initial, released, id, 'RELEASING')
        const edges: SceneEdge[] = []
        for (const edge of current.edges) edges.push({ ...edge, opacity: edge.to === id ? 0 : edge.opacity })
        this.add(3, `Detach value ${entry.value}`, 'Both child subtrees are already empty. Disconnect this node from its parent, or clear root for the final node.', 'parent.child = null  // or root = null', { ...current, edges })
        released.add(id)
        this.add(3, `Release value ${entry.value}`, 'Release this node and continue with the saved parent. Surviving node positions stay fixed.', 'release node\nsize -= 1', this.createFrame(initial, released, null, ''))
      }
    }
    const final = layout.create(this.result.getEntries())
    this.add(4, 'Clear complete', model.length ? 'Every node has been released in postorder. The tree is empty and root is null.' : 'The tree was already empty. Root remains null.', 'root = null\nsize = 0', { ...final, slots: [{ id: 'clear-empty-root', x: 88, y: 110, label: 'root = null', empty: true, highlighted: true, opacity: 1 }] })
  }

  private createFrame(original: Scene, released: ReadonlySet<string>, activeId: string | null, status: string): Scene {
    const nodes: SceneNode[] = []
    const edges: SceneEdge[] = []
    for (const node of original.nodes) {
      if (!released.has(node.id)) nodes.push({ ...node, tone: node.id === activeId ? 'active' : 'default', status: node.id === activeId ? status : undefined })
    }
    for (const edge of original.edges) {
      if (!released.has(edge.from) && !released.has(edge.to)) edges.push({ ...edge })
    }
    return { ...original, nodes, edges, focusId: activeId }
  }
}
