import { Graph } from '../Graph.ts'
import { GraphLayout } from '../GraphLayout.ts'
import { SearchAnimation } from '../SearchByValue/SearchAnimation.ts'
import { AnimationSequence } from '../../../../visualization/AnimationSequence.ts'

export class DeletionAnimation extends AnimationSequence {
  public readonly result: Graph

  public static describe(size: number) {
    return AnimationSequence.information('Delete by value', 'Search breadth-first, then remove the matching vertex and every incident edge.', size,
      ['O(n + e)', 'O(n + e)', 'O(n + e)'], 'On success scan vertices and adjacency lists to rebuild the graph without the target. A miss still searches every component.', 'O(n + e)', 'The rebuilt adjacency lists, traversal queue, vertex lookup, and visited set require linear storage.', [{ symbol: 'e', meaning: 'The number of undirected edges in the original graph.' }])
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
    this.add(6, search.foundId ? 'Deletion complete' : 'Value not found; graph unchanged', `The graph has ${this.result.length} vertices. Only the first breadth-first match is removed.`, search.foundId ? 'commit graph' : 'return notFound', AnimationSequence.message(layout.create(this.result.getEntries()), search.foundId ? `Removed vertex with value ${value}` : `Value ${value} was not found`))
  }
}
