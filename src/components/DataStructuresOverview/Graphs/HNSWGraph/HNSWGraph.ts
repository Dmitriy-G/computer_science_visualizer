import { AppliedModel } from '../../../../visualization/AppliedModel.ts'
import { AppliedGraphModel } from '../../../../visualization/AppliedGraphModel.ts'
import type { AppliedDiagram, DiagramItem, DiagramLink } from '../../../../visualization/AppliedModel.ts'
import { LinearModel } from '../../../../visualization/LinearModel.ts'
import type { LinearInputValues, LinearObserver, LinearResult } from '../../../../visualization/LinearModel.ts'
import type { ActionKind } from '../../../../visualization/ActionCatalog.ts'
import { PointData } from '../../../../visualization/PointData.ts'
import type { PointEntry } from '../../../../visualization/PointData.ts'

interface HNSWVertex extends PointEntry {
  readonly level: number
  readonly neighbors: Map<number, number[]>
}

export class HNSWGraph extends AppliedGraphModel {
  public readonly kind = 'hnsw-graph'
  public readonly representation = 'Incremental multilayer proximity graph: M=4 links per node/layer, efConstruction=16, efSearch=16, and hashed geometric levels capped at three. Upper layers use greedy descent, layer zero uses a bounded best-first beam. Nearest-M selection replaces the production diversity heuristic. Results are approximate; layers and execution are deterministic.'
  public readonly countLabel = 'vectors'
  private vertices = new Map<number, HNSWVertex>()
  private nextId = 1
  private entry: number | null = null
  private topLevel = -1
  public get length(): number { return this.vertices.size }
  public static createDefault(): HNSWGraph {
    const model = new HNSWGraph()
    for (const point of PointData.defaults()) model.execute('insert', { x: point.x, y: point.y })
    return model
  }
  public clone(): HNSWGraph {
    const copy = new HNSWGraph()
    for (const [id, vertex] of this.vertices) {
      const neighbors = new Map<number, number[]>()
      for (const [level, ids] of vertex.neighbors) neighbors.set(level, [...ids])
      copy.vertices.set(id, { ...vertex, neighbors })
    }
    copy.nextId = this.nextId
    copy.entry = this.entry
    copy.topLevel = this.topLevel
    return copy
  }
  public getVertexIds(): number[] { return [...this.vertices.keys()] }
  public getNeighborIds(id: number): readonly number[] { return this.vertices.get(id)?.neighbors.get(0) ?? [] }
  public vertexSceneId(id: number): string { return `hnsw-${id}-0` }
  private sceneId(id: number, level: number): string { return `hnsw-${id}-${level}` }
  public getDiagram(): AppliedDiagram {
    const rows: DiagramItem[][] = []
    const links: DiagramLink[] = []
    for (let level = this.topLevel; level >= 0; level -= 1) {
      const row: DiagramItem[] = []
      for (const vertex of this.vertices.values()) {
        if (vertex.level < level) continue
        const id = this.sceneId(vertex.id, level)
        row.push({ id, text: `(${vertex.x}, ${vertex.y})`, label: `id ${vertex.id} / L${level}${vertex.id === this.entry ? ' / ENTRY' : ''}` })
        for (const neighbor of vertex.neighbors.get(level) ?? []) links.push({ from: id, to: this.sceneId(neighbor, level), label: `L${level}` })
        if (level > 0) links.push({ from: id, to: this.sceneId(vertex.id, level - 1), label: 'down' })
      }
      rows.push(row)
    }
    return { rows, links }
  }
  private ordered(ids: readonly number[], query: { x: number, y: number }): number[] {
    return [...ids].sort((a, b) => PointData.distance(this.vertices.get(a)!, query) - PointData.distance(this.vertices.get(b)!, query) || a - b)
  }
  private greedy(query: { x: number, y: number }, entry: number, level: number, observer?: LinearObserver): number {
    let current = entry
    while (true) {
      LinearModel.emit(observer, this.sceneId(current, level), `Greedily inspect vector ${current} at layer ${level}.`, 'move to a strictly closer neighbor at this layer')
      const candidates = this.ordered([current, ...(this.vertices.get(current)!.neighbors.get(level) ?? [])], query)
      if (candidates[0] === current || PointData.distance(this.vertices.get(candidates[0])!, query) >= PointData.distance(this.vertices.get(current)!, query)) return current
      current = candidates[0]
    }
  }
  private searchLayer(query: { x: number, y: number }, entry: number, level: number, observer?: LinearObserver): number[] {
    const seen = new Set<number>([entry])
    let candidates = [entry]
    let best = [entry]
    while (candidates.length) {
      const current = candidates.shift()!
      const distance = PointData.distance(this.vertices.get(current)!, query)
      if (best.length === 16 && distance > PointData.distance(this.vertices.get(best[best.length - 1])!, query)) break
      LinearModel.emit(observer, this.sceneId(current, level), `Expand candidate ${current} at layer ${level}.`, 'pop closest candidate; retain up to ef=16 best vertices')
      for (const neighbor of this.vertices.get(current)!.neighbors.get(level) ?? []) {
        if (seen.has(neighbor)) continue
        seen.add(neighbor)
        const candidateDistance = PointData.distance(this.vertices.get(neighbor)!, query)
        if (best.length < 16 || candidateDistance <= PointData.distance(this.vertices.get(best[best.length - 1])!, query)) {
          best = this.ordered([...best, neighbor], query).slice(0, 16)
          candidates = this.ordered([...candidates, neighbor], query)
        }
      }
    }
    return best
  }
  public execute(action: ActionKind, input: LinearInputValues, observer?: LinearObserver): LinearResult {
    if (action === 'breadth-first' || action === 'depth-first') return this.traverse(action, input, observer)
    if (action === 'inspect-storage') return this.inspect(observer)
    if (action === 'clear') {
      this.vertices.clear()
      this.entry = null
      this.topLevel = -1
      return { description: 'Released all vectors and proximity layers; ID allocation is retained.' }
    }
    if (action === 'search-value') {
      const id = AppliedModel.bounded(input, 'value', 1, Number.MAX_SAFE_INTEGER)
      const vertex = this.vertices.get(id)
      return { description: vertex ? `Vector ${id} is (${vertex.x}, ${vertex.y}) at levels 0..${vertex.level}.` : `Vector ${id} is absent.`, value: vertex ? id : null, activeId: vertex ? this.vertexSceneId(id) : null, status: vertex ? 'FOUND' : 'ABSENT' }
    }
    const query = PointData.read(input)
    if (action === 'nearest-neighbor') {
      if (this.entry === null) return { description: 'The HNSW graph is empty.', value: null, status: 'EMPTY' }
      let entry = this.entry
      for (let level = this.topLevel; level > 0; level -= 1) entry = this.greedy(query, entry, level, observer)
      const candidates = this.searchLayer(query, entry, 0, observer)
      const best = candidates[0]
      return { description: `Approximate nearest vector ${best}; squared distance ${PointData.distance(query, this.vertices.get(best)!)}. Search can miss the global nearest vector.`, value: best, activeId: this.vertexSceneId(best), status: 'APPROXIMATE' }
    }
    if (action !== 'insert') throw new RangeError('Unsupported HNSW action')
    if (this.length === 64) return this.reject('At most 64 vectors are supported.')
    const id = this.nextId++
    let level = 0
    let bits = Math.imul(id, 0x9e3779b1) >>> 0
    while (level < 3 && (bits & 3) === 0) {
      level += 1
      bits >>>= 2
    }
    const vertex: HNSWVertex = { ...query, id, level, neighbors: new Map() }
    for (let layer = 0; layer <= level; layer += 1) vertex.neighbors.set(layer, [])
    if (this.entry === null) {
      this.vertices.set(id, vertex)
      this.entry = id
      this.topLevel = level
      return { description: `Created first vector ${id}, levels 0..${level}.`, activeId: this.vertexSceneId(id) }
    }
    let entry = this.entry
    for (let layer = this.topLevel; layer > level; layer -= 1) entry = this.greedy(query, entry, layer, observer)
    // Publish only after constructing all links, keeping every recorded scene consistent.
    const selections = new Map<number, number[]>()
    for (let layer = Math.min(level, this.topLevel); layer >= 0; layer -= 1) {
      const candidates = this.searchLayer(query, entry, layer, observer)
      selections.set(layer, candidates.slice(0, 4))
      entry = candidates[0]
    }
    this.vertices.set(id, vertex)
    for (const [layer, neighbors] of selections) {
      vertex.neighbors.set(layer, neighbors)
      for (const neighbor of neighbors) {
        const target = this.vertices.get(neighbor)!
        target.neighbors.set(layer, this.ordered([...(target.neighbors.get(layer) ?? []), id], target).slice(0, 4))
      }
    }
    if (level > this.topLevel) {
      this.topLevel = level
      this.entry = id
    }
    LinearModel.emit(observer, this.vertexSceneId(id), `Publish vector ${id} and bounded neighbor lists through level ${level}.`, 'connect nearest M; prune reciprocal lists; update entry layer', 'NEW')
    return { description: `Inserted vector ${id} at levels 0..${level}.`, activeId: this.vertexSceneId(id) }
  }
}
