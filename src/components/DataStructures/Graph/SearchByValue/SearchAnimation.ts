import { Graph } from '../Graph.ts'
import { GraphLayout } from '../GraphLayout.ts'
import { AnimationSequence } from '../../../../visualization/AnimationSequence.ts'

export class SearchAnimation extends AnimationSequence {
  public readonly result: Graph
  public readonly foundId: string | null

  public static describe(size: number) {
    return AnimationSequence.information(
      'Search by value',
      'Search breadth-first across connected components.',
      size,
      ['O(n)', 'O(n + e)', 'O(n + e)'],
      'Best O(n): build the lookup before the first comparison. Worst O(n + e): visit every vertex and edge. Average is an upper bound; it depends on graph shape and target distribution. Assumes expected O(1) Map access.',
      'O(n)',
      'Every case uses O(n) for the lookup, queue, and visited set.',
      [{ symbol: 'e', meaning: 'The number of undirected edges in the original graph.' }],
    )
  }

  constructor(model: Graph, value: number) {
    super()
    this.result = model.clone()
    if (!Number.isSafeInteger(value)) throw new TypeError('Values must be safe integers')
    const path = model.getSearchPath(value)
    const scene = new GraphLayout().create(model.getEntries())
    this.add(1, 'Start the search', 'Build a lookup of vertices by ID. Start a breadth-first queue at the first vertex; later restart at any unvisited component.', 'byId = buildVertexLookup(graph)\nqueue = [firstVertex]\nvisited = {firstVertex}', scene)
    const visited: string[] = []
    for (let index = 0; index < path.length; index += 1) {
      const entry = path[index]
      this.add(2, `Compare ${value} with ${entry.value}`, 'Take the next queued vertex and compare its value. A visited set ensures cycles cannot cause repeated visits.', `current = queue.dequeue()\nif (current.value === ${value}) return current`, AnimationSequence.mark(scene, entry.id, visited))
      visited.push(entry.id)
      if (index + 1 < path.length) {
        this.add(2, 'Continue breadth-first search', 'Enqueue undiscovered neighbors. If the queue is empty, restart at the next unvisited component; consecutive visited vertices need not share an edge.', 'enqueue undiscovered neighbors of current\nif queue.empty: enqueue next unvisited vertex', AnimationSequence.mark(scene, path[index + 1].id, visited))
      }
    }
    const last = path[path.length - 1]
    const success = last !== undefined && last.value === value
    this.foundId = success ? last.id : null
    const message = success ? `Found ${value}` : `Value ${value} was not found`
    const resultScene = AnimationSequence.mark(scene, this.foundId, visited, 'FOUND')
    this.add(3, success ? 'Element found' : 'No matching element', message, success ? 'return current' : 'return notFound', resultScene)
    this.add(4, 'Search complete', `${message}. The graph is unchanged.`, '// no mutation', resultScene)
  }
}
