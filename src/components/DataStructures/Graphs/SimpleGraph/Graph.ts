export interface GraphEntry {
  readonly id: string
  readonly value: number
  readonly neighborIds: readonly string[]
}

interface GraphVertex {
  readonly id: string
  readonly value: number
  readonly neighborIds: string[]
}

export class Graph {
  private entries: GraphVertex[] = []
  private nextId = 0

  public get length(): number { return this.entries.length }

  public static createDefault(): Graph {
    const graph = new Graph()
    for (let value = 10; value <= 100; value += 10) graph.addVertex(value)
    const entries = graph.getEntries()
    for (let index = 0; index < 10; index += 1) graph.connect(entries[index].id, entries[(index + 1) % 10].id)
    for (const [from, to] of [[0, 4], [2, 7], [5, 9]]) graph.connect(entries[from].id, entries[to].id)
    return graph
  }

  public addVertex(value: number): GraphEntry {
    if (!Number.isSafeInteger(value)) throw new TypeError('Values must be safe integers')
    const entry: GraphVertex = { id: `graph-${this.nextId}`, value, neighborIds: [] }
    this.nextId += 1
    this.entries.push(entry)
    return { ...entry, neighborIds: [] }
  }

  public connect(from: string, to: string): void {
    if (!this.entries.some((entry) => entry.id === from) || !this.entries.some((entry) => entry.id === to))
      throw new RangeError('Both vertices must exist')
    for (let index = 0; index < this.entries.length; index += 1) {
      const entry = this.entries[index]
      const neighbor = entry.id === from ? to : entry.id === to ? from : null
      if (neighbor !== null && !entry.neighborIds.includes(neighbor))
        this.entries[index] = { ...entry, neighborIds: [...entry.neighborIds, neighbor] }
    }
  }

  // Breadth-first traversal restarts at each unvisited connected component.
  public getSearchPath(value: number): GraphEntry[] {
    if (!Number.isSafeInteger(value)) throw new TypeError('Values must be safe integers')
    const byId = new Map<string, GraphVertex>()
    for (const entry of this.entries) byId.set(entry.id, entry)
    const seen = new Set<string>()
    const path: GraphEntry[] = []
    for (const start of this.entries) {
      if (seen.has(start.id)) continue
      const queue = [start]
      seen.add(start.id)
      for (let index = 0; index < queue.length; index += 1) {
        const current = queue[index]
        path.push({ ...current, neighborIds: [...current.neighborIds] })
        if (current.value === value) return path
        for (const id of current.neighborIds) {
          if (seen.has(id)) continue
          seen.add(id)
          queue.push(byId.get(id)!)
        }
      }
    }
    return path
  }

  public deleteValue(value: number): GraphEntry | null {
    const path = this.getSearchPath(value)
    const target = path[path.length - 1]
    if (!target || target.value !== value) return null
    const remaining: GraphVertex[] = []
    for (const entry of this.entries) {
      if (entry.id === target.id) continue
      const neighborIds: string[] = []
      for (const id of entry.neighborIds) if (id !== target.id) neighborIds.push(id)
      remaining.push({ ...entry, neighborIds })
    }
    this.entries = remaining
    return target
  }

  public clear(): void {
    for (const entry of this.entries) {
      while (entry.neighborIds.length > 0) entry.neighborIds.pop()
    }
    while (this.entries.length > 0) this.entries.pop()
  }

  public getEntries(): GraphEntry[] {
    const entries: GraphEntry[] = []
    for (const entry of this.entries) entries.push({ ...entry, neighborIds: [...entry.neighborIds] })
    return entries
  }

  public clone(): Graph {
    const copy = new Graph()
    for (const entry of this.entries) {
      copy.entries.push({ ...entry, neighborIds: [...entry.neighborIds] })
    }
    copy.nextId = this.nextId
    return copy
  }
}
