import { ExtendedGraphModel } from '../ExtendedGraphModel.ts'
import type { ExtendedEdge, ExtendedVertex } from '../ExtendedGraphModel.ts'
import type { LinearObserver, LinearResult } from '../../../../visualization/LinearModel.ts'

export class AdjacencyMatrix extends ExtendedGraphModel {
  public readonly kind = 'adjacency-matrix'
  public readonly directed = true
  private cells: (ExtendedEdge | null)[][] = []
  private count = 0
  public get edgeCount(): number { return this.count }
  public get hint(): string { return 'Canonical storage is a square adjacency matrix. Row i is the source and column j is the target; 1 means an edge, 0 means absence. Self-loops use the diagonal. Vertex deletion removes its row and column, shifting storage indices while preserving vertex IDs.' }
  protected empty(): AdjacencyMatrix { return new AdjacencyMatrix() }

  public static createDefault(): AdjacencyMatrix {
    const graph = new AdjacencyMatrix()
    for (let value = 10; value <= 100; value += 10) graph.appendVertex(value)
    for (const [a, b] of [[0, 1], [0, 3], [1, 2], [2, 0], [3, 4], [4, 5], [5, 6], [6, 7], [7, 8], [8, 9]]) graph.putEdge(graph.vertices[a], graph.vertices[b])
    return graph
  }

  public getCell(row: number, column: number): ExtendedEdge | null { return this.cells[row][column] }
  public getMatrix(): readonly (readonly number[])[] {
    const matrix: number[][] = []
    for (const row of this.cells) {
      const values: number[] = []
      for (const cell of row) values.push(cell ? 1 : 0)
      matrix.push(values)
    }
    return matrix
  }

  protected storedVertexAdded(_vertex: ExtendedVertex): void {
    for (const row of this.cells) row.push(null)
    this.cells.push(new Array<ExtendedEdge | null>(this.length).fill(null))
  }
  protected storedVertexRemoved(_id: string, index: number): void {
    for (let column = 0; column < this.length; column += 1) if (this.cells[index][column]) this.count -= 1
    for (let row = 0; row < this.length; row += 1) if (row !== index && this.cells[row][index]) this.count -= 1
    this.cells.splice(index, 1)
    for (const row of this.cells) row.splice(index, 1)
  }
  protected storeEdge(edge: ExtendedEdge): void {
    const row = this.vertexIndex(edge.from)
    const column = this.vertexIndex(edge.to)
    if (!this.cells[row][column]) this.count += 1
    this.cells[row][column] = edge
  }
  protected validateEdge(from: ExtendedVertex, to: ExtendedVertex): void {
    if (this.count >= ExtendedGraphModel.maximumEdges) throw new RangeError('This teaching example allows at most 128 edges')
    if (this.cells[this.vertexIndex(from.id)][this.vertexIndex(to.id)]) throw new RangeError('This edge already exists')
  }
  protected eraseEdge(number: number): void {
    for (const row of this.cells) for (let column = 0; column < row.length; column += 1) if (row[column]?.number === number) {
      row[column] = null
      this.count -= 1
    }
  }
  public getEdges(): readonly ExtendedEdge[] {
    const edges: ExtendedEdge[] = []
    for (const row of this.cells) for (const edge of row) if (edge) edges.push({ ...edge })
    return edges
  }
  public getNeighbors(id: string): readonly string[] {
    const index = this.vertexIndex(id)
    const neighbors: string[] = []
    if (index >= 0) for (const edge of this.cells[index]) if (edge) neighbors.push(edge.to)
    return neighbors
  }
  protected inspect(observer?: LinearObserver): LinearResult {
    for (let row = 0; row < this.length; row += 1) for (let column = 0; column < this.length; column += 1) this.emit(observer, `matrix-${row}-${column}`, `Row ${row} (${this.vertices[row].value}), column ${column} (${this.vertices[column].value}) = ${this.cells[row][column] ? 1 : 0}.`, 'read matrix[row][column]')
    return { description: `${this.length} × ${this.length} cells encode ${this.edgeCount} directed edges.`, value: this.edgeCount }
  }
}
