import type { ActionKind } from './ActionCatalog.ts'

export type GraphKind = 'graph' | 'directed-graph' | 'weighted-graph' | 'dag' | 'multigraph'
export type GraphInputValues = Readonly<Record<string, string | number>>

export interface GraphEntry {
  readonly id: string
  readonly value: number
  readonly neighborIds: readonly string[]
}

export interface GraphEdge {
  readonly id: string
  readonly number: number
  readonly from: string
  readonly to: string
  readonly weight: number
}

interface GraphVertex {
  readonly id: string
  readonly value: number
  readonly outgoing: Set<string>
}

export interface GraphTraceEvent {
  readonly title: string
  readonly description: string
  readonly code: string
  readonly activeId?: string
  readonly edgeId?: string
}

export interface GraphTraceObserver {
  onGraphChange(event: GraphTraceEvent): void
}

export interface GraphOperationResult {
  readonly description: string
  readonly code: string
  readonly activeIds?: readonly string[]
  readonly edgeIds?: readonly string[]
  readonly error?: boolean
}

// Adjacency sets store edge IDs, so parallel edges retain their own identities.
// Models emit synchronous events; animation timing and snapshots live elsewhere.
export abstract class GraphModel {
  public abstract readonly kind: GraphKind
  private vertices = new Map<string, GraphVertex>()
  private edges = new Map<string, GraphEdge>()
  private nextVertex = 0
  private nextEdge = 0

  public get length(): number { return this.vertices.size }
  public get edgeCount(): number { return this.edges.size }
  public get directed(): boolean { return this.kind === 'directed-graph' || this.kind === 'dag' }
  public get weighted(): boolean { return this.kind === 'weighted-graph' }
  public abstract clone(): GraphModel

  protected copyInto(copy: GraphModel): void {
    for (const vertex of this.vertices.values()) copy.vertices.set(vertex.id, { ...vertex, outgoing: new Set(vertex.outgoing) })
    for (const edge of this.edges.values()) copy.edges.set(edge.id, { ...edge })
    copy.nextVertex = this.nextVertex
    copy.nextEdge = this.nextEdge
  }

  public addVertex(value: number): GraphEntry {
    GraphModel.integer(value)
    const id = `${this.kind}-${this.nextVertex++}`
    this.vertices.set(id, { id, value, outgoing: new Set() })
    return { id, value, neighborIds: [] }
  }

  public connect(from: string, to: string, weight = 1, observer?: GraphTraceObserver): void {
    if (!this.vertices.has(from) || !this.vertices.has(to)) throw new RangeError('Both vertices must exist')
    GraphModel.integer(weight)
    if (weight < 0) throw new RangeError('Weights must be nonnegative')
    if (!this.weighted && weight !== 1) throw new RangeError('This graph has unweighted edges')
    if (this.kind !== 'multigraph') {
      for (const edgeId of this.vertices.get(from)!.outgoing) {
        const edge = this.edges.get(edgeId)!
        if (this.neighbor(edge, from) === to) return
      }
    }
    if (this.kind === 'dag' && (from === to || this.walk(to, false, from, observer).includes(from)))
      throw new RangeError('This edge would create a directed cycle; the DAG is unchanged')
    const number = this.nextEdge++
    const edge = { id: `${this.kind}-edge-${number}`, number, from, to, weight }
    this.edges.set(edge.id, edge)
    this.vertices.get(from)!.outgoing.add(edge.id)
    if (!this.directed) this.vertices.get(to)!.outgoing.add(edge.id)
    observer?.onGraphChange({ title: 'Connect the edge', description: `Add e${number}${this.weighted ? ` with weight ${weight}` : ''}.`, code: `edges.add(e${number})`, activeId: to, edgeId: edge.id })
  }

  public getEdges(): GraphEdge[] { return Array.from(this.edges.values(), (edge) => ({ ...edge })) }

  private entry(vertex: GraphVertex): GraphEntry {
    const neighbors = new Set<string>()
    for (const edgeId of vertex.outgoing) neighbors.add(this.neighbor(this.edges.get(edgeId)!, vertex.id))
    return { id: vertex.id, value: vertex.value, neighborIds: [...neighbors] }
  }

  public getEntries(): GraphEntry[] { return Array.from(this.vertices.values(), (vertex) => this.entry(vertex)) }

  private neighbor(edge: GraphEdge, from: string): string { return edge.from === from ? edge.to : edge.from }

  private walk(start: string, depthFirst: boolean, targetId?: string, observer?: GraphTraceObserver): string[] {
    const pending = [start]
    const seen = new Set<string>([start])
    const path: string[] = []
    if (depthFirst) {
      const stack = [{ id: start, edges: this.vertices.get(start)!.outgoing.values() }]
      path.push(start)
      observer?.onGraphChange({ title: 'Visit a vertex', description: `Visit ${this.vertices.get(start)!.value} and start its branch.`, code: `visit(${this.vertices.get(start)!.value})`, activeId: start })
      while (stack.length > 0) {
        const frame = stack[stack.length - 1]
        const edge = frame.edges.next()
        if (edge.done) { stack.pop(); continue }
        const next = this.neighbor(this.edges.get(edge.value)!, frame.id)
        observer?.onGraphChange({ title: 'Inspect an edge', description: 'Descend only if the endpoint is undiscovered.', code: 'if not discovered: push neighbor frame', activeId: frame.id, edgeId: edge.value })
        if (seen.has(next)) continue
        seen.add(next)
        path.push(next)
        observer?.onGraphChange({ title: 'Visit a vertex', description: `Visit ${this.vertices.get(next)!.value} before returning to the previous branch.`, code: `visit(${this.vertices.get(next)!.value})`, activeId: next })
        if (next === targetId) break
        stack.push({ id: next, edges: this.vertices.get(next)!.outgoing.values() })
      }
      return path
    }
    let head = 0
    while (head < pending.length) {
      const id = pending[head++]
      const vertex = this.vertices.get(id)!
      path.push(id)
      observer?.onGraphChange({ title: 'Visit a vertex', description: `Visit ${vertex.value} from the queue.`, code: `visit(${vertex.value})`, activeId: id })
      if (id === targetId) break
      for (const edgeId of vertex.outgoing) {
        const next = this.neighbor(this.edges.get(edgeId)!, id)
        observer?.onGraphChange({ title: 'Inspect an edge', description: `Inspect the edge to ${this.vertices.get(next)!.value}.`, code: 'if not discovered: enqueue(neighbor)', activeId: id, edgeId })
        if (!seen.has(next)) {
          seen.add(next)
          pending.push(next)
        }
      }
    }
    return path
  }

  private search(value: number, observer?: GraphTraceObserver): string[] {
    GraphModel.integer(value)
    // A single BFS frontier per component, with one shared visited set.
    const seen = new Set<string>()
    const path: string[] = []
    for (const start of this.vertices.keys()) {
      if (seen.has(start)) continue
      const queue = [start]
      seen.add(start)
      for (let head = 0; head < queue.length; head += 1) {
        const id = queue[head]
        const vertex = this.vertices.get(id)!
        path.push(id)
        observer?.onGraphChange({ title: 'Compare a vertex', description: `Compare ${vertex.value} with ${value}.`, code: `if ${vertex.value} == ${value}: return true`, activeId: id })
        if (vertex.value === value) return path
        for (const edgeId of vertex.outgoing) {
          const neighbor = this.neighbor(this.edges.get(edgeId)!, id)
          observer?.onGraphChange({ title: 'Inspect an edge', description: 'Queue its endpoint if it has not been discovered.', code: 'if not discovered: enqueue(neighbor)', activeId: id, edgeId })
          if (!seen.has(neighbor)) { seen.add(neighbor); queue.push(neighbor) }
        }
      }
    }
    return path
  }

  public getSearchPath(value: number): GraphEntry[] { return this.search(value).map((id) => this.entry(this.vertices.get(id)!)) }

  private removeEdge(id: string, observer?: GraphTraceObserver): void {
    const edge = this.edges.get(id)!
    observer?.onGraphChange({ title: 'Detach an edge', description: `Remove e${edge.number} from the endpoint adjacency sets.`, code: `remove(e${edge.number})`, activeId: edge.from, edgeId: id })
    this.vertices.get(edge.from)!.outgoing.delete(id)
    if (!this.directed) this.vertices.get(edge.to)!.outgoing.delete(id)
    this.edges.delete(id)
    observer?.onGraphChange({ title: 'Edge removed', description: `Edge e${edge.number} is detached.`, code: 'edgeCount -= 1', activeId: edge.from })
  }

  private removeVertex(id: string, observer?: GraphTraceObserver): GraphEntry {
    const vertex = this.entry(this.vertices.get(id)!)
    for (const edge of this.edges.values()) if (edge.from === id || edge.to === id) this.removeEdge(edge.id, observer)
    this.vertices.delete(id)
    observer?.onGraphChange({ title: 'Release the vertex', description: `Remove ${vertex.value} after its incident edges.`, code: `vertices.delete(${vertex.value})` })
    return vertex
  }

  public deleteValue(value: number): GraphEntry | null {
    const path = this.search(value)
    const id = path[path.length - 1]
    return id && this.vertices.get(id)!.value === value ? this.removeVertex(id) : null
  }

  public clear(observer?: GraphTraceObserver): void {
    for (const id of this.edges.keys()) this.removeEdge(id, observer)
    for (const vertex of this.vertices.values()) {
      this.vertices.delete(vertex.id)
      observer?.onGraphChange({ title: 'Release a vertex', description: `Release ${vertex.value}.`, code: `vertices.delete(${vertex.value})` })
    }
  }

  private topological(observer?: GraphTraceObserver): string[] {
    if (this.kind !== 'dag') throw new RangeError('Topological sort requires the DAG')
    const indegrees = new Map<string, number>()
    for (const id of this.vertices.keys()) indegrees.set(id, 0)
    for (const edge of this.edges.values()) indegrees.set(edge.to, indegrees.get(edge.to)! + 1)
    const queue: string[] = []
    for (const [id, degree] of indegrees) if (degree === 0) queue.push(id)
    const order: string[] = []
    for (let head = 0; head < queue.length; head += 1) {
      const id = queue[head]
      order.push(id)
      observer?.onGraphChange({ title: 'Emit a ready vertex', description: `${this.vertices.get(id)!.value} has no remaining predecessors.`, code: 'order.push(readyVertex)', activeId: id })
      for (const edgeId of this.vertices.get(id)!.outgoing) {
        const edge = this.edges.get(edgeId)!
        const degree = indegrees.get(edge.to)! - 1
        indegrees.set(edge.to, degree)
        observer?.onGraphChange({ title: 'Release a dependency', description: `${this.vertices.get(edge.to)!.value} has ${degree} remaining predecessors.`, code: `indegree[${this.vertices.get(edge.to)!.value}] = ${degree}`, activeId: edge.to, edgeId })
        if (degree === 0) queue.push(edge.to)
      }
    }
    if (order.length !== this.length) throw new RangeError('A cycle prevents topological ordering')
    return order
  }

  private shortestPath(start: string, target: string, observer?: GraphTraceObserver): GraphOperationResult {
    if (!this.weighted) throw new RangeError('Dijkstra requires the weighted graph')
    const distances = new Map<string, bigint | null>()
    const previous = new Map<string, { id: string, edgeId: string }>()
    const settled = new Set<string>()
    for (const id of this.vertices.keys()) distances.set(id, null)
    distances.set(start, 0n)
    while (settled.size < this.length) {
      let current: string | undefined
      let minimum: bigint | null = null
      for (const [id, distance] of distances) {
        if (!settled.has(id) && distance !== null && (minimum === null || distance < minimum)) { current = id; minimum = distance }
      }
      if (current === undefined) break
      settled.add(current)
      observer?.onGraphChange({ title: 'Settle the nearest vertex', description: `Distance to ${this.vertices.get(current)!.value} is ${minimum}.`, code: `distance[${this.vertices.get(current)!.value}] = ${minimum}`, activeId: current })
      if (current === target) break
      for (const edgeId of this.vertices.get(current)!.outgoing) {
        const edge = this.edges.get(edgeId)!
        const next = this.neighbor(edge, current)
        const candidate = minimum! + BigInt(edge.weight)
        const old = distances.get(next)!
        if (!settled.has(next) && (old === null || candidate < old)) {
          distances.set(next, candidate)
          previous.set(next, { id: current, edgeId })
          observer?.onGraphChange({ title: 'Relax an edge', description: `Improve the distance to ${this.vertices.get(next)!.value} to ${candidate}.`, code: `distance[${this.vertices.get(next)!.value}] = ${candidate}`, activeId: next, edgeId })
        } else observer?.onGraphChange({ title: 'Inspect an edge', description: 'This edge cannot improve the known distance.', code: 'keep the current distance', activeId: current, edgeId })
      }
    }
    const distance = distances.get(target)!
    if (distance === null) return { description: 'The target is unreachable from the source.', code: 'return { distance: Infinity, path: [] }' }
    const path = [target]
    const edgeIds: string[] = []
    let id = target
    while (id !== start) {
      const predecessor = previous.get(id)!
      edgeIds.push(predecessor.edgeId)
      id = predecessor.id
      path.push(id)
    }
    path.reverse()
    edgeIds.reverse()
    const values = path.map((entry) => this.vertices.get(entry)!.value)
    return { description: `Shortest distance: ${distance}. Path: ${values.join(' → ')}.`, code: `return { distance: ${distance}, path: [${values.join(', ')}] }`, activeIds: path, edgeIds }
  }

  public execute(action: ActionKind, input: GraphInputValues, observer?: GraphTraceObserver): GraphOperationResult {
    const number = (name: string): number => {
      const value = input[name]
      if (typeof value !== 'number') throw new TypeError(`Enter ${name}`)
      GraphModel.integer(value)
      return value
    }
    const vertex = (name: string): string => {
      const value = number(name)
      for (const entry of this.vertices.values()) if (entry.value === value) return entry.id
      throw new RangeError(`Vertex ${value} does not exist`)
    }
    const edge = (): GraphEdge => {
      const id = number('edge')
      const entry = this.edges.get(`${this.kind}-edge-${id}`)
      if (!entry) throw new RangeError(`Edge e${id} does not exist`)
      return entry
    }
    try {
      if (action === 'add-vertex') {
        const value = number('value')
        for (const entry of this.vertices.values()) {
          observer?.onGraphChange({ title: 'Check uniqueness', description: `Compare ${entry.value} with ${value}.`, code: `if ${entry.value} == ${value}: reject duplicate`, activeId: entry.id })
          if (entry.value === value) throw new RangeError('The visualizer requires unique vertex values')
        }
        const entry = this.addVertex(value)
        observer?.onGraphChange({ title: 'Create a vertex', description: `Add isolated vertex ${value}.`, code: `vertices.add(${value})`, activeId: entry.id })
        return { description: `Added vertex ${value}.`, code: `return ${value}`, activeIds: [entry.id] }
      }
      if (action === 'add-edge') {
        const from = vertex('from')
        const to = vertex('to')
        const before = this.edgeCount
        this.connect(from, to, this.weighted ? number('weight') : 1, observer)
        const added = this.edgeCount > before
        return { description: added ? 'The edge is connected.' : 'This edge already exists; the graph is unchanged.', code: `return ${added}` }
      }
      if (action === 'remove-edge') {
        this.removeEdge(edge().id, observer)
        return { description: 'The selected edge is removed. Other parallel edges are preserved.', code: 'return true' }
      }
      if (action === 'update-weight') {
        if (!this.weighted) throw new RangeError('Only the weighted graph supports weights')
        const selected = edge()
        const weight = number('weight')
        if (weight < 0) throw new RangeError('Weights must be nonnegative')
        this.edges.set(selected.id, { ...selected, weight })
        observer?.onGraphChange({ title: 'Update the edge weight', description: `Set e${selected.number} to ${weight}.`, code: `e${selected.number}.weight = ${weight}`, edgeId: selected.id })
        return { description: `Edge e${selected.number} now has weight ${weight}.`, code: `return ${weight}`, edgeIds: [selected.id] }
      }
      if (action === 'breadth-first' || action === 'depth-first' || action === 'topological-sort') {
        const ids = action === 'topological-sort' ? this.topological(observer) : this.walk(vertex('start'), action === 'depth-first', undefined, observer)
        const values = ids.map((id) => this.vertices.get(id)!.value)
        return { description: values.length ? `Order: ${values.join(' → ')}.` : 'The ordering is empty.', code: `return [${values.join(', ')}]`, activeIds: ids }
      }
      if (action === 'shortest-path') return this.shortestPath(vertex('from'), vertex('to'), observer)
      if (action === 'search-value' || action === 'delete-value') {
        const value = number('value')
        const path = this.search(value, observer)
        const id = path[path.length - 1]
        const found = !!id && this.vertices.get(id)!.value === value
        if (found && action === 'delete-value') this.removeVertex(id, observer)
        return { description: found ? `${value} ${action === 'delete-value' ? 'and its incident edges were removed' : 'was found'}.` : `${value} is absent.`, code: `return ${found}`, activeIds: found && action === 'search-value' ? [id] : [] }
      }
      if (action === 'clear') {
        this.clear(observer)
        return { description: 'All edges and vertices are released.', code: 'return { vertices: 0, edges: 0 }' }
      }
      throw new RangeError('Unsupported graph action')
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      return { description: message, code: `throw Error(${JSON.stringify(message)})`, error: true }
    }
  }

  private static integer(value: number): void {
    if (!Number.isSafeInteger(value)) throw new TypeError('Values must be safe integers')
  }
}
