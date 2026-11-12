import { StoredEdgeGraph } from '../../../../visualization/StoredEdgeGraph.ts'
import type { ExtendedVertex } from '../../../../visualization/ExtendedGraphModel.ts'
import { LinearModel } from '../../../../visualization/LinearModel.ts'
import type { LinearInputValues, LinearObserver, LinearResult } from '../../../../visualization/LinearModel.ts'
import type { ActionKind } from '../../../../visualization/ActionCatalog.ts'

export class BipartiteGraph extends StoredEdgeGraph {
  public readonly kind = 'bipartite-graph'
  public readonly directed = false
  protected empty(): BipartiteGraph { return new BipartiteGraph() }

  public static createDefault(): BipartiteGraph {
    const graph = new BipartiteGraph()
    for (let index = 0; index < 10; index += 1) graph.appendVertex((index + 1) * 10, index < 5 ? 0 : 1)
    for (const [a, b] of [[0, 5], [0, 6], [1, 6], [1, 7], [2, 7], [2, 8], [3, 8], [3, 9], [4, 9]]) graph.putEdge(graph.vertices[a], graph.vertices[b])
    return graph
  }

  protected validateEdge(from: ExtendedVertex, to: ExtendedVertex): void {
    if (from.partition === to.partition) throw new RangeError('Bipartite edges must cross L and R')
    super.validateEdge(from, to)
  }

  protected perform(action: ActionKind, input: LinearInputValues, observer?: LinearObserver): LinearResult {
    if (action !== 'add-vertex') return super.perform(action, input, observer)
    const value = LinearModel.integer(input, 'value')
    const partition = LinearModel.integer(input, 'partition')
    if (partition !== 0 && partition !== 1) throw new RangeError('Partition must be 0 (L) or 1 (R)')
    const vertex = this.appendVertex(value, partition)
    this.emit(observer, vertex.id, `Add ${value} to partition ${partition === 0 ? 'L' : 'R'}.`, 'add vertex with fixed partition', [], 'NEW')
    return { description: `Added ${value} to ${partition === 0 ? 'L' : 'R'}.`, activeId: vertex.id }
  }
}
