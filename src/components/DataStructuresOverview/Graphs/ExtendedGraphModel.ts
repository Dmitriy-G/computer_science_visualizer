import { LinearModel } from '../../../visualization/LinearModel.ts'
import type { LinearInputValues, LinearObserver, LinearResult } from '../../../visualization/LinearModel.ts'
import type { ActionKind } from '../../../visualization/ActionCatalog.ts'

export interface ExtendedVertex {
  readonly id: string
  readonly value: number
  readonly partition?: number
}

export interface ExtendedEdge {
  readonly id: string
  readonly number: number
  readonly from: string
  readonly to: string
  readonly members?: readonly string[]
  readonly capacity?: number
  flow?: bigint
}

export abstract class ExtendedGraphModel extends LinearModel {
  public static readonly maximumVertices = 16
  public static readonly maximumEdges = 128
  protected vertices: ExtendedVertex[] = []
  private readonly byValue = new Map<number, ExtendedVertex>()
  private readonly byId = new Map<string, ExtendedVertex>()
  private readonly positions = new Map<string, number>()
  protected nextVertex = 0
  protected nextEdge = 0
  public get length(): number { return this.vertices.length }
  public abstract readonly directed: boolean
  public abstract get hint(): string
  public abstract getEdges(): readonly ExtendedEdge[]
  public abstract getNeighbors(id: string): readonly string[]
  protected abstract empty(): ExtendedGraphModel
  protected abstract storedVertexAdded(vertex: ExtendedVertex): void
  protected abstract storedVertexRemoved(id: string, index: number): void
  protected abstract storeEdge(edge: ExtendedEdge): void
  protected abstract eraseEdge(number: number): void

  public getVertices(): readonly ExtendedVertex[] { return this.vertices }
  public get edgeCount(): number { return this.getEdges().length }

  protected emit(observer: LinearObserver | undefined, activeId: string | null, description: string, code: string, edgeIds: readonly string[] = [], status?: string): void {
    observer?.onLinearChange({ activeId, description, code, edgeIds, status })
  }

  protected vertex(value: number): ExtendedVertex {
    const vertex = this.byValue.get(value)
    if (vertex) return vertex
    throw new RangeError(`Vertex ${value} does not exist`)
  }

  protected vertexIndex(id: string): number { return this.positions.get(id) ?? -1 }

  protected validateNewValue(value: number): void {
    if (!Number.isSafeInteger(value)) throw new TypeError('Vertex values must be safe integers')
    if (this.byValue.has(value)) throw new RangeError(`Vertex ${value} already exists`)
    if (this.length >= ExtendedGraphModel.maximumVertices) throw new RangeError('This teaching example allows at most 16 vertices')
  }

  protected beforeMutation(): void {}

  protected appendVertex(value: number, partition?: number): ExtendedVertex {
    this.validateNewValue(value)
    this.beforeMutation()
    const vertex = { id: `${this.kind}-v${this.nextVertex++}`, value, partition }
    this.vertices.push(vertex)
    this.byValue.set(value, vertex)
    this.byId.set(vertex.id, vertex)
    this.positions.set(vertex.id, this.length - 1)
    this.storedVertexAdded(vertex)
    return vertex
  }

  protected validateEdge(from: ExtendedVertex, to: ExtendedVertex): void {
    if (this.edgeCount >= ExtendedGraphModel.maximumEdges) throw new RangeError('This teaching example allows at most 128 edges')
    for (const edge of this.getEdges()) {
      if (edge.from === from.id && edge.to === to.id || !this.directed && edge.from === to.id && edge.to === from.id) throw new RangeError('This edge already exists')
    }
  }

  protected putEdge(from: ExtendedVertex, to: ExtendedVertex, capacity?: number, members?: readonly string[]): ExtendedEdge {
    this.validateEdge(from, to)
    this.beforeMutation()
    const number = this.nextEdge++
    const edge: ExtendedEdge = { id: `${this.kind}-e${number}`, number, from: from.id, to: to.id, capacity, members, flow: capacity === undefined ? undefined : 0n }
    this.storeEdge(edge)
    return edge
  }

  protected canDelete(_vertex: ExtendedVertex): void {}

  protected removeVertex(value: number, observer?: LinearObserver): LinearResult {
    const index = this.vertices.findIndex((vertex) => vertex.value === value)
    if (index < 0) return { description: `Vertex ${value} was not found.`, value: false, status: 'NOT FOUND' }
    const vertex = this.vertices[index]
    this.canDelete(vertex)
    this.beforeMutation()
    this.storedVertexRemoved(vertex.id, index)
    this.vertices.splice(index, 1)
    this.byValue.delete(vertex.value)
    this.byId.delete(vertex.id)
    this.positions.delete(vertex.id)
    for (let position = index; position < this.length; position += 1) this.positions.set(this.vertices[position].id, position)
    this.emit(observer, null, `Release vertex ${value} and repair its incident storage.`, 'remove incident entries; remove vertex; update storage indices')
    return { description: `Deleted vertex ${value}; surviving vertex and edge IDs remain stable.`, value: true }
  }

  protected copyInto(copy: ExtendedGraphModel): void {
    for (const vertex of this.vertices) {
      const cloned = { ...vertex }
      copy.vertices.push(cloned)
      copy.byValue.set(cloned.value, cloned)
      copy.byId.set(cloned.id, cloned)
      copy.positions.set(cloned.id, copy.length - 1)
      copy.storedVertexAdded(cloned)
    }
    for (const edge of this.getEdges()) copy.storeEdge({ ...edge, members: edge.members ? [...edge.members] : undefined })
    copy.nextVertex = this.nextVertex
    copy.nextEdge = this.nextEdge
  }

  public clone(): ExtendedGraphModel {
    const copy = this.empty()
    this.copyInto(copy)
    return copy
  }

  protected inspect(observer?: LinearObserver): LinearResult {
    for (const vertex of this.vertices) this.emit(observer, vertex.id, `Vertex ${vertex.value} has ${this.getNeighbors(vertex.id).length} reachable neighbors in this representation.`, 'read stored neighbors of vertex')
    return { description: `${this.length} vertices and ${this.edgeCount} stored edges.`, value: this.edgeCount }
  }

  private depthVisit(id: string, seen: Set<string>, order: number[], observer?: LinearObserver): void {
    seen.add(id)
    const vertex = this.byId.get(id)!
    order.push(vertex.value)
    this.emit(observer, id, `DFS visits ${vertex.value} before descending to an undiscovered neighbor.`, 'visit(vertex); recursively visit unseen neighbors')
    for (const next of this.getNeighbors(id)) if (!seen.has(next)) this.depthVisit(next, seen, order, observer)
  }

  protected traverse(action: ActionKind, start: number, observer?: LinearObserver): LinearResult {
    const source = this.vertex(start)
    const seen = new Set<string>()
    const order: number[] = []
    if (action === 'depth-first') this.depthVisit(source.id, seen, order, observer)
    else {
      const queue = [source.id]
      seen.add(source.id)
      for (let head = 0; head < queue.length; head += 1) {
        const id = queue[head]
        const vertex = this.byId.get(id)!
        order.push(vertex.value)
        this.emit(observer, id, `BFS visits ${vertex.value}; undiscovered neighbors join the queue.`, 'vertex = queue[head++]; enqueue unseen neighbors')
        for (const next of this.getNeighbors(id)) if (!seen.has(next)) {
          seen.add(next)
          queue.push(next)
        }
      }
    }
    const last = this.byValue.get(order[order.length - 1])
    return { description: `${action === 'depth-first' ? 'DFS' : 'BFS'} from ${start}: ${order.join(', ')}. Only reachable vertices are visited.`, value: order, activeId: last?.id, status: 'VISITED' }
  }

  protected perform(action: ActionKind, input: LinearInputValues, observer?: LinearObserver): LinearResult {
    if (action === 'add-vertex') {
      const vertex = this.appendVertex(LinearModel.integer(input, 'value'))
      this.emit(observer, vertex.id, `Create vertex ${vertex.value}.`, 'allocate vertex and its storage row', [], 'NEW')
      return { description: `Added vertex ${vertex.value}.`, activeId: vertex.id }
    }
    if (action === 'add-edge') {
      const from = this.vertex(LinearModel.integer(input, 'from'))
      const to = this.vertex(LinearModel.integer(input, 'to'))
      const edge = this.putEdge(from, to)
      this.emit(observer, from.id, `Store edge e${edge.number}: ${from.value} ${this.directed ? '→' : '—'} ${to.value}.`, 'insert edge in canonical storage', [edge.id], 'NEW')
      return { description: `Added edge e${edge.number}.`, activeId: to.id }
    }
    if (action === 'remove-edge') {
      const number = LinearModel.integer(input, 'edge')
      const edge = this.getEdges().find((entry) => entry.number === number)
      if (!edge) return { description: `Edge e${number} does not exist.`, value: false }
      this.emit(observer, edge.from, `Locate edge e${number} in storage.`, 'locate edge by stable ID', [edge.id])
      this.beforeMutation()
      this.eraseEdge(number)
      this.emit(observer, edge.from, `Remove edge e${number}; repair storage offsets or links.`, 'remove edge; repair representation')
      return { description: `Removed edge e${number}.`, value: true }
    }
    if (action === 'delete-value') return this.removeVertex(LinearModel.integer(input, 'value'), observer)
    if (action === 'search-value') {
      const value = LinearModel.integer(input, 'value')
      for (const vertex of this.vertices) {
        this.emit(observer, vertex.id, `Compare vertex ${vertex.value} with ${value}.`, 'if vertex.value == target: return true')
        if (vertex.value === value) return { description: `Found vertex ${value}.`, value: true, activeId: vertex.id, status: 'FOUND' }
      }
      return { description: `Vertex ${value} was not found.`, value: false, status: 'NOT FOUND' }
    }
    if (action === 'breadth-first' || action === 'depth-first') return this.traverse(action, LinearModel.integer(input, 'start'), observer)
    if (action === 'inspect-storage') return this.inspect(observer)
    if (action !== 'clear') throw new RangeError('Unsupported graph action')
    this.beforeMutation()
    // Clear bypasses leaf-only deletion policies while releasing canonical storage.
    while (this.vertices.length) {
      const index = this.vertices.length - 1
      const vertex = this.vertices[index]
      this.storedVertexRemoved(vertex.id, index)
      this.vertices.pop()
      this.byValue.delete(vertex.value)
      this.byId.delete(vertex.id)
      this.positions.delete(vertex.id)
      this.emit(observer, null, `Release vertex ${vertex.value} and its stored incidences.`, 'release final vertex and its storage')
    }
    return { description: 'All vertices and stored edges have been released.' }
  }

  public execute(action: ActionKind, input: LinearInputValues, observer?: LinearObserver): LinearResult {
    try { return this.perform(action, input, observer) }
    catch (error) {
      if (!(error instanceof RangeError) && !(error instanceof TypeError)) throw error
      return { description: `Rejected: ${error.message}.`, status: 'REJECTED' }
    }
  }
}
