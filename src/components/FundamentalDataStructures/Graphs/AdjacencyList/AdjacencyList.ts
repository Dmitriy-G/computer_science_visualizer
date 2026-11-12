import { ExtendedGraphModel } from '../../../../visualization/ExtendedGraphModel.ts'
import type { ExtendedEdge, ExtendedVertex } from '../../../../visualization/ExtendedGraphModel.ts'
import type { LinearObserver, LinearResult } from '../../../../visualization/LinearModel.ts'

export class AdjacencyList extends ExtendedGraphModel {
  public readonly kind = 'adjacency-list'
  public readonly directed = true
  private readonly rows = new Map<string, ExtendedEdge[]>()
  private count = 0
  public get edgeCount(): number { return this.count }
  protected empty(): AdjacencyList { return new AdjacencyList() }

  public static createDefault(): AdjacencyList {
    const graph = new AdjacencyList()
    for (let value = 10; value <= 100; value += 10) graph.appendVertex(value)
    for (const [a, b] of [[0, 1], [0, 3], [1, 2], [2, 0], [3, 4], [4, 5], [5, 6], [6, 7], [7, 8], [8, 9]]) graph.putEdge(graph.vertices[a], graph.vertices[b])
    return graph
  }

  public getRow(id: string): readonly ExtendedEdge[] { return this.rows.get(id) ?? [] }
  protected storedVertexAdded(vertex: ExtendedVertex): void { this.rows.set(vertex.id, []) }
  protected storedVertexRemoved(id: string, _index: number): void {
    this.count -= this.rows.get(id)!.length
    this.rows.delete(id)
    for (const [source, edges] of this.rows) {
      const kept = edges.filter((edge) => edge.to !== id)
      this.count -= edges.length - kept.length
      this.rows.set(source, kept)
    }
  }
  protected storeEdge(edge: ExtendedEdge): void {
    this.rows.get(edge.from)!.push(edge)
    this.count += 1
  }
  protected validateEdge(from: ExtendedVertex, to: ExtendedVertex): void {
    if (this.count >= ExtendedGraphModel.maximumEdges) throw new RangeError('This teaching example allows at most 128 edges')
    for (const edge of this.rows.get(from.id)!) if (edge.to === to.id) throw new RangeError('This edge already exists')
  }
  protected eraseEdge(number: number): void {
    for (const [source, edges] of this.rows) {
      const kept = edges.filter((edge) => edge.number !== number)
      this.count -= edges.length - kept.length
      this.rows.set(source, kept)
    }
  }
  public getEdges(): readonly ExtendedEdge[] {
    const edges: ExtendedEdge[] = []
    for (const row of this.rows.values()) for (const edge of row) edges.push({ ...edge })
    return edges
  }
  public getNeighbors(id: string): readonly string[] {
    const values: string[] = []
    for (const edge of this.rows.get(id) ?? []) values.push(edge.to)
    return values
  }
  protected inspect(observer?: LinearObserver): LinearResult {
    for (const vertex of this.vertices) {
      this.emit(observer, vertex.id, `Read ${vertex.value}'s adjacency head (${this.getRow(vertex.id).length} outgoing entries).`, 'row = adjacency[vertex]')
      for (const edge of this.getRow(vertex.id)) this.emit(observer, `list-${edge.number}`, `Follow e${edge.number} to its stored target.`, 'for edge in row: read edge.target', [edge.id])
    }
    return { description: `${this.length} adjacency rows store ${this.edgeCount} outgoing entries.`, value: this.edgeCount }
  }
}
