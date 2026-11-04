import { AppliedModel } from '../../../../visualization/AppliedModel.ts'
import type { AppliedDiagram } from '../../../../visualization/AppliedModel.ts'
import { LinearModel } from '../../../../visualization/LinearModel.ts'
import type { LinearInputValues, LinearObserver, LinearResult } from '../../../../visualization/LinearModel.ts'
import type { ActionKind } from '../../../../visualization/ActionCatalog.ts'
import { PointData } from '../../../../visualization/PointData.ts'
import type { PointEntry } from '../../../../visualization/PointData.ts'

export class LSHIndex extends AppliedModel {
  public readonly kind = 'lsh-index'
  public readonly representation = 'Eight fixed hyperplanes encode each 2D vector as a binary sign code. Queries exhaustively compare code Hamming distances, as in a flat binary-code LSH index. Results approximate angular similarity, not exact Euclidean nearest neighbors; there are no trained FAISS rotations or bucket probes.'
  private readonly planes = [[17, -43], [-31, 11], [23, 37], [-47, -19], [7, 53], [41, 13], [-29, 43], [37, -7]]
  private entries: { point: PointEntry, code: number }[] = []
  private nextId = 1
  public get length(): number { return this.entries.length }
  public static createDefault(): LSHIndex {
    const model = new LSHIndex()
    for (const point of PointData.defaults()) model.execute('insert', { x: point.x, y: point.y })
    return model
  }
  private encode(point: { x: number, y: number }): number {
    let code = 0
    for (let bit = 0; bit < this.planes.length; bit += 1) if (point.x * this.planes[bit][0] + point.y * this.planes[bit][1] >= 0) code |= 1 << bit
    return code
  }
  public clone(): LSHIndex {
    const copy = new LSHIndex()
    copy.entries = this.entries.map((entry) => ({ point: { ...entry.point }, code: entry.code }))
    copy.nextId = this.nextId
    return copy
  }
  public getDiagram(): AppliedDiagram {
    return { rows: [this.planes.map(([x, y], index) => ({ id: `lsh-plane-${index}`, text: `${x}x ${y >= 0 ? '+' : '-'} ${Math.abs(y)}y`, label: `bit ${index}: dot >= 0` })), this.entries.map(({ point, code }) => ({ id: `lsh-${point.id}`, text: code.toString(2).padStart(8, '0'), label: `id ${point.id} / (${point.x}, ${point.y})` }))] }
  }
  public execute(action: ActionKind, input: LinearInputValues, observer?: LinearObserver): LinearResult {
    if (action === 'inspect-storage') return this.inspect(observer)
    if (action === 'clear') {
      this.entries = []
      return { description: 'Released all codes and vectors; hyperplanes and ID allocation remain fixed.' }
    }
    const point = PointData.read(input)
    const code = this.encode(point)
    for (let bit = 0; bit < 8; bit += 1) LinearModel.emit(observer, `lsh-plane-${bit}`, `Query sign bit ${bit} is ${(code >>> bit) & 1}.`, 'bit = dot(vector, plane) >= 0')
    if (action === 'insert') {
      if (this.length === 64) return this.reject('At most 64 vectors are supported.')
      const entry = { point: { ...point, id: this.nextId++ }, code }
      this.entries.push(entry)
      return { description: `Stored vector ${entry.point.id} with code ${code.toString(2).padStart(8, '0')}.`, activeId: `lsh-${entry.point.id}` }
    }
    if (action !== 'nearest-neighbor') throw new RangeError('Unsupported LSH action')
    let minimum = 9
    let best: number | null = null
    for (const entry of this.entries) {
      let xor = code ^ entry.code
      let distance = 0
      while (xor) {
        xor &= xor - 1
        distance += 1
      }
      LinearModel.emit(observer, `lsh-${entry.point.id}`, `Hamming distance to code ${entry.point.id}: ${distance}.`, 'popcount(queryCode XOR storedCode)')
      if (distance < minimum) {
        minimum = distance
        best = entry.point.id
      }
    }
    return { description: best === null ? 'The LSH index is empty.' : `Approximate match: vector ${best}, Hamming distance ${minimum}. Ties use insertion order; this is not an exact Euclidean result.`, value: best, activeId: best === null ? null : `lsh-${best}`, status: best === null ? 'EMPTY' : 'APPROXIMATE' }
  }
}
