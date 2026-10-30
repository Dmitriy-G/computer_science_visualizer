import { Graph } from '../Graph.ts'
import { GraphLayout } from '../GraphLayout.ts'
import { AnimationSequence } from '../../../../../visualization/AnimationSequence.ts'
import type { Scene, SceneNode, SceneEdge } from '../../../../../visualization/Scene.ts'

export class ClearAnimation extends AnimationSequence {
  public readonly result: Graph

  public static describe(size: number) {
    return AnimationSequence.information(
      'Clear', 'Release all adjacency records, then every vertex.', size,
      ['O(n + e)', 'O(n + e)', 'O(n + e)'],
      'For the same graph size, every case releases all adjacency records and vertices, including isolated vertices and disconnected components. Empty graphs return immediately.',
      'O(1)', 'The model scans its vertex collection and empties each adjacency list in place, without a traversal queue, visited set, or replacement graph.',
      [{ symbol: 'e', meaning: 'The number of undirected edges in the original graph; each ordinary edge has two adjacency records.' }],
    )
  }

  constructor(model: Graph) {
    super()
    this.result = model.clone()
    this.result.clear()
    const layout = new GraphLayout()
    const initial = layout.create(model.getEntries())
    const releasedEdges = new Set<string>()
    const releasedVertices = new Set<string>()
    this.add(1, 'Inspect vertices and adjacency lists', 'Clear scans the complete vertex collection, so it includes isolated vertices and every disconnected component.', 'for vertex in vertices:', this.createFrame(initial, releasedVertices, releasedEdges, null))
    for (const edge of initial.edges) {
      const current = this.createFrame(initial, releasedVertices, releasedEdges, edge.from)
      const edges: SceneEdge[] = []
      for (const candidate of current.edges) edges.push({ ...candidate, highlighted: candidate.id === edge.id })
      this.add(2, 'Inspect an edge', edge.from === edge.to ? 'Release this self-loop adjacency record.' : 'Release the adjacency records for both endpoints of this undirected edge.', 'release adjacency records for edge', { ...current, edges })
      releasedEdges.add(edge.id)
      const released = this.createFrame(initial, releasedVertices, releasedEdges, edge.from)
      this.add(2, 'Release the edge', 'Fade the released edge. Keep every vertex in place while the remaining adjacency records are released.', 'remove edge', { ...released, edges: [...released.edges, { ...edge, opacity: 0 }] })
    }
    for (const node of initial.nodes) {
      this.add(3, `Release vertex ${node.value}`, 'Every adjacency list is empty. Release this vertex record, including isolated vertices.', 'release vertex', this.createFrame(initial, releasedVertices, releasedEdges, node.id))
      releasedVertices.add(node.id)
      this.add(3, 'Advance to the next vertex', 'Continue through the vertex collection without searching by value. Duplicate values remain separate vertices.', 'advance vertex iterator', this.createFrame(initial, releasedVertices, releasedEdges, null))
    }
    this.add(4, 'Clear complete', model.length ? 'All edges and vertices have been released. The graph is empty.' : 'The graph was already empty. There are no edges or vertices to release.', 'vertices = empty', layout.create(this.result.getEntries()))
  }

  private createFrame(original: Scene, releasedVertices: ReadonlySet<string>, releasedEdges: ReadonlySet<string>, activeId: string | null): Scene {
    const nodes: SceneNode[] = []
    const edges: SceneEdge[] = []
    for (const node of original.nodes) {
      if (!releasedVertices.has(node.id)) nodes.push({ ...node, tone: node.id === activeId ? 'active' : 'default', status: node.id === activeId ? 'RELEASING' : undefined })
    }
    for (const edge of original.edges) {
      if (!releasedEdges.has(edge.id) && !releasedVertices.has(edge.from) && !releasedVertices.has(edge.to)) edges.push({ ...edge })
    }
    return { ...original, nodes, edges, focusId: activeId }
  }
}
