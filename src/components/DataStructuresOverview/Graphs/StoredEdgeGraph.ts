import { ExtendedGraphModel } from './ExtendedGraphModel.ts'
import type { ExtendedEdge, ExtendedVertex } from './ExtendedGraphModel.ts'

export abstract class StoredEdgeGraph extends ExtendedGraphModel {
  protected edges: ExtendedEdge[] = []
  public get edgeCount(): number { return this.edges.length }

  public getEdges(): readonly ExtendedEdge[] {
    const edges: ExtendedEdge[] = []
    for (const edge of this.edges) edges.push({ ...edge, members: edge.members ? [...edge.members] : undefined })
    return edges
  }

  protected storedVertexAdded(_vertex: ExtendedVertex): void {}
  protected storedVertexRemoved(id: string, _index: number): void { this.edges = this.edges.filter((edge) => edge.from !== id && edge.to !== id) }
  protected storeEdge(edge: ExtendedEdge): void { this.edges.push(edge) }
  protected eraseEdge(number: number): void { this.edges = this.edges.filter((edge) => edge.number !== number) }

  public getNeighbors(id: string): readonly string[] {
    const neighbors = new Set<string>()
    for (const edge of this.edges) {
      if (edge.from === id) neighbors.add(edge.to)
      if (!this.directed && edge.to === id) neighbors.add(edge.from)
    }
    return Array.from(neighbors)
  }
}
