import { StoredEdgeGraph } from '../StoredEdgeGraph.ts'
import type { ExtendedEdge } from '../ExtendedGraphModel.ts'
import { LinearModel } from '../../../../visualization/LinearModel.ts'
import type { LinearInputValues, LinearObserver, LinearResult } from '../../../../visualization/LinearModel.ts'
import type { ActionKind } from '../../../../visualization/ActionCatalog.ts'

export class Hypergraph extends StoredEdgeGraph {
  public readonly kind = 'hypergraph'
  public readonly directed = false
  public get hint(): string { return 'Each undirected hyperedge is a set of 2–16 distinct existing vertices. Square H nodes show hyperedges and incidence lines show membership; they are not ordinary vertices or pairwise graph edges. Vertex deletion shrinks hyperedges, dropping small or duplicate sets and keeping the first surviving ID.' }
  protected empty(): Hypergraph { return new Hypergraph() }

  public static parseMembers(text: string): readonly number[] {
    if (text.length > 320 || !/^\s*-?\d+(?:\s*,\s*-?\d+)+\s*$/.test(text)) throw new TypeError('Enter 2 to 16 comma-separated vertex values')
    const values: number[] = []
    const seen = new Set<number>()
    for (const item of text.split(',')) {
      const value = Number(item.trim())
      if (!Number.isSafeInteger(value) || seen.has(value)) throw new RangeError('Hyperedge members must be distinct safe integers')
      seen.add(value)
      values.push(value)
    }
    if (values.length > 16) throw new RangeError('A hyperedge may contain at most 16 vertices')
    return values
  }

  public static createDefault(): Hypergraph {
    const graph = new Hypergraph()
    for (let value = 10; value <= 100; value += 10) graph.appendVertex(value)
    for (const members of ['10,20,30', '30,40,50,60', '20,60,70', '70,80,90,100']) graph.perform('add-edge', { members })
    return graph
  }

  public getNeighbors(id: string): readonly string[] {
    const values = new Set<string>()
    for (const edge of this.edges) if (edge.members?.includes(id)) for (const member of edge.members) if (member !== id) values.add(member)
    return Array.from(values)
  }

  protected storedVertexRemoved(id: string, _index: number): void {
    const remaining: ExtendedEdge[] = []
    for (const edge of this.edges) {
      const members = edge.members!.filter((member) => member !== id)
      const duplicate = remaining.some((other) => other.members!.length === members.length && members.every((member) => other.members!.includes(member)))
      if (members.length >= 2 && !duplicate) remaining.push({ ...edge, members, from: members[0], to: members[1] })
    }
    this.edges = remaining
  }

  protected perform(action: ActionKind, input: LinearInputValues, observer?: LinearObserver): LinearResult {
    if (action !== 'add-edge') return super.perform(action, input, observer)
    const values = Hypergraph.parseMembers(String(input.members ?? ''))
    const members: string[] = []
    for (const value of values) members.push(this.vertex(value).id)
    if (this.edges.length >= 32) throw new RangeError('This teaching example allows at most 32 hyperedges')
    for (const edge of this.edges) if (edge.members!.length === members.length && members.every((member) => edge.members!.includes(member))) throw new RangeError('This hyperedge already exists')
    const number = this.nextEdge++
    const edge = { id: `hypergraph-e${number}`, number, from: members[0], to: members[1], members }
    this.storeEdge(edge)
    this.emit(observer, `hyperedge-${number}`, `Create hyperedge h${number} containing ${values.join(', ')}.`, 'store a set of vertex IDs; add incidence links', [edge.id], 'NEW')
    return { description: `Added hyperedge h${number} with ${members.length} members.`, activeId: `hyperedge-${number}` }
  }
}
