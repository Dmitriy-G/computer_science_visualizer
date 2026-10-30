import { Graph } from '../Graph.ts'
import { GraphLayout } from '../GraphLayout.ts'
import { SearchAnimation } from '../SearchByValue/SearchAnimation.ts'
import { AnimationSequence } from '../../../../../visualization/AnimationSequence.ts'

export class DeletionAnimation extends AnimationSequence {
  public readonly result: Graph

  public static describe(size: number) {
    return AnimationSequence.information(
      'Delete by value',
      'Remove the first breadth-first match and its edges.',
      size,
      ['O(n + e)', 'O(n + e)', 'O(n + e)'],
      'Every case is O(n + e): a match rebuilds the graph; a miss searches every component. Even finding the first vertex does not avoid rebuilding.',
      ['O(n)', 'O(n + e)', 'O(n + e)'],
      'Best O(n) for a miss: lookup, queue, and visited set. Worst O(n + e) for a successful deletion: rebuilt adjacency lists. Average assumes a constant success probability.',
      [{ symbol: 'e', meaning: 'The number of undirected edges in the original graph.' }],
    )
  }

  constructor(model: Graph, value: number) {
    super()
    const search = new SearchAnimation(model, value)
    this.steps.push(...search.steps.slice(0, -1))
    this.result = model.clone()
    const layout = new GraphLayout()
    if (search.foundId !== null) {
      let scene = AnimationSequence.mark(layout.create(model.getEntries()), search.foundId, [], 'REMOVE')
      for (const incident of scene.edges) {
        if (incident.from !== search.foundId && incident.to !== search.foundId) continue
        const edges = []
        for (const edge of scene.edges) edges.push({ ...edge, opacity: edge.id === incident.id ? 0 : edge.opacity })
        scene = { ...scene, edges }
        this.add(4, 'Remove an incident edge', 'Remove this undirected edge from both endpoints. Other vertices and edges remain.', 'removeEdge(vertex, neighbor)', scene)
      }
      const nodes = []
      for (const node of scene.nodes) nodes.push({ ...node, opacity: node.id === search.foundId ? 0 : 1 })
      this.add(5, 'Remove the vertex', 'All incident edges are gone. Remove the vertex; this may split a connected component.', 'removeVertex(current)', { ...scene, nodes, focusId: null })
      this.result.deleteValue(value)
    }
    this.add(6, search.foundId ? 'Deletion complete' : 'Value not found; graph unchanged', search.foundId ? `Removed the first breadth-first match for ${value} and its incident edges. The graph now has ${this.result.length} vertices.` : `Value ${value} was not found. The graph still has ${model.length} vertices.`, search.foundId ? 'commit graph' : 'return notFound', layout.create(this.result.getEntries()))
  }
}
