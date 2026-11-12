import { StoredEdgeGraph } from '../../../../visualization/StoredEdgeGraph.ts'
import type { LinearObserver, LinearResult } from '../../../../visualization/LinearModel.ts'

export class EdgeList extends StoredEdgeGraph {
  public readonly kind = 'edge-list'
  public readonly directed = true
  protected empty(): EdgeList { return new EdgeList() }

  public static createDefault(): EdgeList {
    const graph = new EdgeList()
    for (let value = 10; value <= 100; value += 10) graph.appendVertex(value)
    for (const [a, b] of [[0, 1], [0, 3], [1, 2], [2, 0], [3, 4], [4, 5], [5, 6], [6, 7], [7, 8], [8, 9]]) graph.putEdge(graph.vertices[a], graph.vertices[b])
    return graph
  }

  protected inspect(observer?: LinearObserver): LinearResult {
    for (let index = 0; index < this.edges.length; index += 1) this.emit(observer, `edge-record-${this.edges[index].number}`, `Read edge record ${index}, stable ID e${this.edges[index].number}.`, 'read edges[index].source and edges[index].target', [this.edges[index].id])
    return { description: `${this.edges.length} edge records and ${this.length} separately registered vertices.`, value: this.edges.length }
  }
}
