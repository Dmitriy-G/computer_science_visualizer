import { Graph } from '../Graph.ts'
import { GraphLayout } from '../GraphLayout.ts'
import { AnimationSequence } from '../../../../visualization/AnimationSequence.ts'

export class SearchAnimation extends AnimationSequence {
  public readonly result: Graph
  public readonly foundId: string | null

  public static describe(size: number) {
    return AnimationSequence.information('Search by value', 'Search breadth-first across every connected component.', size, ['O(n)', 'O(n + e)', 'O(n + e)'], 'Build a vertex lookup, then inspect vertices and adjacency lists in breadth-first order. The lookup alone takes linear time.', 'O(n)', 'The lookup, queue, and visited set each need at most one entry per vertex.', [{ symbol: 'e', meaning: 'The number of undirected edges in the original graph.' }])
  }

  constructor(model: Graph, value: number) {
    super()
    this.result = model.clone()
    if (!Number.isSafeInteger(value)) throw new TypeError('Values must be safe integers')
    const path = model.getSearchPath(value)
    const scene = new GraphLayout().create(model.getEntries())
    this.add(1, 'Start the search', 'Search breadth-first across every connected component.', 'current = start', scene)
    const visited: string[] = []
    for (let index = 0; index < path.length; index += 1) {
      const entry = path[index]
      this.add(2, `Compare ${value} with ${entry.value}`, 'Visit each vertex once in breadth-first order, restarting at unvisited components. A visited set prevents cycles.', `if (${value} === ${entry.value}) return current`, AnimationSequence.mark(scene, entry.id, visited))
      visited.push(entry.id)
      if (index + 1 < path.length) {
        this.add(2, 'Follow the search path', 'Move to the next candidate without changing the structure.', `current = ${'next candidate'}`, AnimationSequence.mark(scene, path[index + 1].id, visited))
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
