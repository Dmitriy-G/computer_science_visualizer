import { AppliedModel } from '../../../../visualization/AppliedModel.ts'
import type { AppliedDiagram } from '../../../../visualization/AppliedModel.ts'
import { LinearModel } from '../../../../visualization/LinearModel.ts'
import type { LinearInputValues, LinearObserver, LinearResult } from '../../../../visualization/LinearModel.ts'
import type { ActionKind } from '../../../../visualization/ActionCatalog.ts'
import { PointData } from '../../../../visualization/PointData.ts'
import type { PointEntry } from '../../../../visualization/PointData.ts'

interface Centroid { readonly x: number, readonly y: number }

export class IVFIndex extends AppliedModel {
  public readonly kind = 'ivf-index'
  public readonly representation = 'A 2D IVF-flat index trains up to eight coarse centroids with eight deterministic Lloyd iterations, seeded by the first distinct points. Each actual inverted list stores complete vectors. Queries rank centroids and scan only the requested number of lists; probing every list is exact. This is coarse vector quantization without product quantization or compressed residuals.'
  public readonly countLabel = 'vectors'
  private lists: PointEntry[][] = []
  private centroids: Centroid[] = []
  private nextId = 1
  public get length(): number {
    let count = 0
    for (const list of this.lists) count += list.length
    return count
  }
  public static createDefault(): IVFIndex {
    const model = new IVFIndex()
    model.execute('build-values', { values: '0:0,40:40,80:80,1:2,3:1,39:42,42:39,79:82,83:79,5:4', clusters: 3 })
    return model
  }
  public clone(): IVFIndex {
    const copy = new IVFIndex()
    copy.lists = this.lists.map((list) => list.map((point) => ({ ...point })))
    copy.centroids = this.centroids.map((centroid) => ({ ...centroid }))
    copy.nextId = this.nextId
    return copy
  }
  private closest(point: Centroid): number {
    let best = 0
    for (let index = 1; index < this.centroids.length; index += 1) {
      if (PointData.distance(point, this.centroids[index]) < PointData.distance(point, this.centroids[best])) best = index
    }
    return best
  }
  private assign(points: readonly PointEntry[]): void {
    this.lists = this.centroids.map(() => [])
    for (const point of points) this.lists[this.closest(point)].push(point)
  }
  public getDiagram(): AppliedDiagram {
    return { rows: [
      this.centroids.map((centroid, index) => ({ id: `ivf-centroid-${index}`, text: `${Number(centroid.x.toFixed(2))},${Number(centroid.y.toFixed(2))}`, label: `centroid ${index} / ${this.lists[index].length} vectors`, children: this.lists[index].map((point) => `ivf-vector-${point.id}`) })),
      this.lists.flatMap((list, index) => list.map((point) => ({ id: `ivf-vector-${point.id}`, text: `${point.x},${point.y}`, label: `vector ${point.id} / list ${index}` }))),
    ] }
  }
  public execute(action: ActionKind, input: LinearInputValues, observer?: LinearObserver): LinearResult {
    if (action === 'inspect-storage') return this.inspect(observer)
    if (action === 'build-values') {
      const source = PointData.parse(input.values)
      const clusters = AppliedModel.bounded(input, 'clusters', 1, 8)
      const seeds: Centroid[] = []
      for (const point of source) {
        if (!seeds.some((seed) => seed.x === point.x && seed.y === point.y)) seeds.push({ ...point })
        if (seeds.length === clusters) break
      }
      if (seeds.length < clusters) return this.reject('The number of clusters cannot exceed the number of distinct input vectors.')
      const points: PointEntry[] = []
      for (const point of source) points.push({ ...point, id: this.nextId++ })
      this.centroids = seeds
      this.assign(points)
      for (let iteration = 0; iteration < 8; iteration += 1) {
        const centroids: Centroid[] = []
        for (let index = 0; index < clusters; index += 1) {
          const list = this.lists[index]
          let x = 0
          let y = 0
          for (const point of list) {
            x += point.x
            y += point.y
          }
          centroids.push(list.length ? { x: x / list.length, y: y / list.length } : { ...this.centroids[index] })
        }
        this.centroids = centroids
        this.assign(points)
        for (let index = 0; index < clusters; index += 1) LinearModel.emit(observer, `ivf-centroid-${index}`, `Training iteration ${iteration + 1}: reassign vectors to centroid ${index}.`, 'mean each nonempty cluster; retain empty centroid; reassign to nearest')
      }
      return { description: `Trained ${clusters} centroids for eight iterations and indexed ${points.length} vectors. Displayed centroids are rounded; distances use full precision.` }
    }
    if (action === 'nearest-neighbor') {
      const query = PointData.read(input)
      const probes = AppliedModel.bounded(input, 'probes', 1, 8)
      if (!this.centroids.length) return { description: 'The IVF index is empty.', value: null, status: 'ABSENT' }
      if (probes > this.centroids.length) return this.reject(`Choose at most ${this.centroids.length} probes for this trained index.`)
      const ranked: { index: number, distance: number }[] = []
      for (let index = 0; index < this.centroids.length; index += 1) {
        ranked.push({ index, distance: PointData.distance(query, this.centroids[index]) })
        LinearModel.emit(observer, `ivf-centroid-${index}`, `Compare query with centroid ${index}.`, 'rank centroids by squared distance, then centroid index')
      }
      ranked.sort((a, b) => a.distance - b.distance || a.index - b.index)
      let best: PointEntry | null = null
      let distance = Infinity
      let scanned = 0
      for (let probe = 0; probe < probes; probe += 1) {
        const index = ranked[probe].index
        LinearModel.emit(observer, `ivf-centroid-${index}`, `Probe inverted list ${index}.`, 'scan only selected inverted lists')
        for (const point of this.lists[index]) {
          const candidate = PointData.distance(query, point)
          scanned++
          LinearModel.emit(observer, `ivf-vector-${point.id}`, `Vector ${point.id} has squared distance ${candidate}.`, 'compare full vector; retain best distance with stable-ID ties')
          if (candidate < distance || (candidate === distance && best !== null && point.id < best.id)) {
            best = point
            distance = candidate
          }
        }
      }
      const exact = probes === this.centroids.length
      return { description: best ? `${exact ? 'Exact' : 'Approximate'} nearest vector ${best.id}: (${best.x}, ${best.y}), squared distance ${distance}. Probed ${probes} lists and scanned ${scanned} vectors.` : `The ${probes} probed lists are empty; other lists may contain vectors.`, value: best?.id ?? null, activeId: best ? `ivf-vector-${best.id}` : null, status: best ? 'FOUND' : 'ABSENT' }
    }
    if (action === 'clear') {
      for (const list of this.lists) {
        while (list.length) {
          list.pop()
          LinearModel.emit(observer, null, 'Release one vector from its inverted list.', 'pop vector from inverted list')
        }
      }
      this.lists = []
      this.centroids = []
      return { description: 'Released all vectors, inverted lists, and centroids.' }
    }
    throw new RangeError('Unsupported IVF action')
  }
}
