import { StoredEdgeGraph } from '../../../../visualization/StoredEdgeGraph.ts'
import { LinearModel } from '../../../../visualization/LinearModel.ts'
import type { LinearInputValues, LinearObserver, LinearResult } from '../../../../visualization/LinearModel.ts'
import type { ActionKind } from '../../../../visualization/ActionCatalog.ts'

export class CompleteGraph extends StoredEdgeGraph {
  public readonly kind = 'complete-graph'
  public readonly directed = false
  protected empty(): CompleteGraph { return new CompleteGraph() }

  public getNeighbors(id: string): readonly string[] {
    const neighbors: string[] = []
    if (this.vertexIndex(id) < 0) return neighbors
    for (const vertex of this.vertices) if (vertex.id !== id) neighbors.push(vertex.id)
    return neighbors
  }

  public static createDefault(): CompleteGraph {
    const graph = new CompleteGraph()
    for (let value = 10; value <= 100; value += 10) graph.perform('add-vertex', { value })
    return graph
  }

  protected perform(action: ActionKind, input: LinearInputValues, observer?: LinearObserver): LinearResult {
    if (action === 'add-edge' || action === 'remove-edge') throw new RangeError('Complete-graph edges are managed automatically')
    if (action !== 'add-vertex') return super.perform(action, input, observer)
    const previous = [...this.vertices]
    const vertex = this.appendVertex(LinearModel.integer(input, 'value'))
    for (const other of previous) {
      const number = this.nextEdge++
      this.storeEdge({ id: `${this.kind}-e${number}`, number, from: other.id, to: vertex.id })
    }
    this.emit(observer, vertex.id, `Add ${vertex.value} and its ${previous.length} required edges atomically.`, 'for each old vertex: connect(oldVertex, newVertex)', [], 'NEW')
    return { description: `Complete graph now has ${this.length} vertices and ${this.edgeCount} edges.`, activeId: vertex.id }
  }
}
