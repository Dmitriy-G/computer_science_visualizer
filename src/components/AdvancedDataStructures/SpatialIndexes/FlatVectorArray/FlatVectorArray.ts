import { AppliedModel } from '../../../../visualization/AppliedModel.ts'
import type { AppliedDiagram } from '../../../../visualization/AppliedModel.ts'
import { LinearModel } from '../../../../visualization/LinearModel.ts'
import type { LinearInputValues, LinearObserver, LinearResult } from '../../../../visualization/LinearModel.ts'
import type { ActionKind } from '../../../../visualization/ActionCatalog.ts'
import { PointData } from '../../../../visualization/PointData.ts'
import type { PointEntry } from '../../../../visualization/PointData.ts'

export class FlatVectorArray extends AppliedModel {
  public readonly kind = 'flat-vector-array'
  public readonly representation = 'Contiguous logical slots holding 2D vector records with stable IDs. Nearest-neighbor queries exhaustively compare squared Euclidean distances, returning the lowest ID on a tie. This exact flat index is distinct from approximate graph or hash indexes.'
  private points: PointEntry[] = []
  private nextId = 1
  public get length(): number { return this.points.length }
  public static createDefault(): FlatVectorArray {
    const model = new FlatVectorArray()
    model.points = PointData.defaults()
    model.nextId = 11
    return model
  }
  public clone(): FlatVectorArray {
    const copy = new FlatVectorArray()
    copy.points = this.points.map((point) => ({ ...point }))
    copy.nextId = this.nextId
    return copy
  }
  public getDiagram(): AppliedDiagram { return { rows: [this.points.map((point, index) => ({ id: `flat-${point.id}`, text: `(${point.x}, ${point.y})`, label: `slot ${index} / id ${point.id}` }))] } }
  public execute(action: ActionKind, input: LinearInputValues, observer?: LinearObserver): LinearResult {
    if (action === 'inspect-storage') return this.inspect(observer)
    if (action === 'clear') {
      this.points = []
      return { description: 'Released every vector; stable ID allocation is preserved.' }
    }
    const query = PointData.read(input)
    if (action === 'insert') {
      if (this.length === 64) return this.reject('At most 64 vectors are supported.')
      const point = { ...query, id: this.nextId++ }
      this.points = [...this.points, point]
      LinearModel.emit(observer, `flat-${point.id}`, `Append vector ${point.id} in a new exact-sized array.`, 'vectors = copyAndAppend(vectors, point)', 'NEW')
      return { description: `Inserted vector ${point.id}.`, activeId: `flat-${point.id}` }
    }
    if (action !== 'nearest-neighbor') throw new RangeError('Unsupported flat-vector action')
    let best: PointEntry | null = null
    let distance = Infinity
    for (const point of this.points) {
      const candidate = PointData.distance(query, point)
      LinearModel.emit(observer, `flat-${point.id}`, `Vector ${point.id} has squared distance ${candidate}.`, 'distance = dx*dx + dy*dy; keep minimum')
      if (candidate < distance) {
        best = point
        distance = candidate
      }
    }
    return { description: best ? `Exact nearest vector: ${best.id} (${best.x}, ${best.y}); squared distance ${distance}.` : 'The index is empty.', value: best?.id ?? null, activeId: best ? `flat-${best.id}` : null, status: best ? 'NEAREST' : 'EMPTY' }
  }
}
