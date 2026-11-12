import { ExtendedGraphModel } from '../../../../visualization/ExtendedGraphModel.ts'
import type { ExtendedEdge, ExtendedVertex } from '../../../../visualization/ExtendedGraphModel.ts'
import type { LinearObserver, LinearResult } from '../../../../visualization/LinearModel.ts'

export interface CSRStorage {
  readonly offsets: readonly number[]
  readonly columns: readonly number[]
  readonly edgeNumbers: readonly number[]
}

export class CompressedSparseRow extends ExtendedGraphModel {
  public readonly kind = 'compressed-sparse-row'
  public readonly directed = true
  private offsets: number[] = [0]
  private columns: number[] = []
  private edgeNumbers: number[] = []
  public get edgeCount(): number { return this.columns.length }
  protected empty(): CompressedSparseRow { return new CompressedSparseRow() }

  public static createDefault(): CompressedSparseRow {
    const graph = new CompressedSparseRow()
    for (let value = 10; value <= 100; value += 10) graph.appendVertex(value)
    for (const [a, b] of [[0, 1], [0, 3], [1, 2], [2, 0], [3, 4], [4, 5], [5, 6], [6, 7], [7, 8], [8, 9]]) graph.putEdge(graph.vertices[a], graph.vertices[b])
    return graph
  }

  public getStorage(): CSRStorage { return { offsets: [...this.offsets], columns: [...this.columns], edgeNumbers: [...this.edgeNumbers] } }
  protected storedVertexAdded(_vertex: ExtendedVertex): void { this.offsets.push(this.columns.length) }
  protected validateEdge(from: ExtendedVertex, to: ExtendedVertex): void {
    if (this.edgeCount >= ExtendedGraphModel.maximumEdges) throw new RangeError('This teaching example allows at most 128 edges')
    const row = this.vertexIndex(from.id)
    const column = this.vertexIndex(to.id)
    for (let index = this.offsets[row]; index < this.offsets[row + 1]; index += 1) if (this.columns[index] === column) throw new RangeError('This edge already exists')
  }

  protected storeEdge(edge: ExtendedEdge): void {
    const row = this.vertexIndex(edge.from)
    const column = this.vertexIndex(edge.to)
    let index = this.offsets[row]
    while (index < this.offsets[row + 1] && this.columns[index] < column) index += 1
    this.columns.splice(index, 0, column)
    this.edgeNumbers.splice(index, 0, edge.number)
    for (let next = row + 1; next < this.offsets.length; next += 1) this.offsets[next] += 1
  }

  protected eraseEdge(number: number): void {
    const index = this.edgeNumbers.indexOf(number)
    if (index < 0) return
    let row = 0
    while (this.offsets[row + 1] <= index) row += 1
    this.columns.splice(index, 1)
    this.edgeNumbers.splice(index, 1)
    for (let next = row + 1; next < this.offsets.length; next += 1) this.offsets[next] -= 1
  }

  protected storedVertexRemoved(_id: string, removed: number): void {
    const offsets = [0]
    const columns: number[] = []
    const numbers: number[] = []
    for (let row = 0; row < this.length; row += 1) {
      if (row === removed) continue
      for (let index = this.offsets[row]; index < this.offsets[row + 1]; index += 1) {
        const column = this.columns[index]
        if (column === removed) continue
        columns.push(column > removed ? column - 1 : column)
        numbers.push(this.edgeNumbers[index])
      }
      offsets.push(columns.length)
    }
    this.offsets = offsets
    this.columns = columns
    this.edgeNumbers = numbers
  }

  public getEdges(): readonly ExtendedEdge[] {
    const edges: ExtendedEdge[] = []
    for (let row = 0; row < this.length; row += 1) for (let index = this.offsets[row]; index < this.offsets[row + 1]; index += 1) {
      const number = this.edgeNumbers[index]
      edges.push({ id: `${this.kind}-e${number}`, number, from: this.vertices[row].id, to: this.vertices[this.columns[index]].id })
    }
    return edges
  }
  public getNeighbors(id: string): readonly string[] {
    const row = this.vertexIndex(id)
    const neighbors: string[] = []
    if (row >= 0) for (let index = this.offsets[row]; index < this.offsets[row + 1]; index += 1) neighbors.push(this.vertices[this.columns[index]].id)
    return neighbors
  }
  protected inspect(observer?: LinearObserver): LinearResult {
    for (let row = 0; row < this.length; row += 1) {
      this.emit(observer, `csr-offset-${row}`, `Row ${row} uses packed positions [${this.offsets[row]}, ${this.offsets[row + 1]}).`, 'start = offsets[row]; end = offsets[row + 1]')
      for (let index = this.offsets[row]; index < this.offsets[row + 1]; index += 1) this.emit(observer, `csr-column-${index}`, `columns[${index}] = ${this.columns[index]}, edge e${this.edgeNumbers[index]}.`, 'neighbor = vertices[columns[index]]')
    }
    return { description: `${this.offsets.length} offsets and ${this.columns.length} column entries encode ${this.edgeCount} directed edges.`, value: this.edgeCount, activeId: `csr-offset-${this.length}` }
  }
}
