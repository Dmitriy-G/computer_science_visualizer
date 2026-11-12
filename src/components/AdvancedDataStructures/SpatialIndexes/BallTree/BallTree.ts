import { AppliedModel } from '../../../../visualization/AppliedModel.ts'
import type { AppliedDiagram, DiagramItem } from '../../../../visualization/AppliedModel.ts'
import { LinearModel } from '../../../../visualization/LinearModel.ts'
import type { LinearInputValues, LinearObserver, LinearResult } from '../../../../visualization/LinearModel.ts'
import type { ActionKind } from '../../../../visualization/ActionCatalog.ts'
import { PointData } from '../../../../visualization/PointData.ts'
import type { PointEntry } from '../../../../visualization/PointData.ts'

interface BallNode {
  readonly id: number
  readonly x: number
  readonly y: number
  readonly radius: number
  readonly points: readonly PointEntry[]
  readonly children: readonly BallNode[]
}

export class BallTree extends AppliedModel {
  public readonly kind = 'ball-tree'
  public readonly representation = 'Bulk-built Euclidean bounding balls with centroid centers, enclosing radii, median partitions, and three-point leaves. Exact nearest-neighbor search uses the triangle-inequality lower bound. This is a 2D teaching variant, without configurable production metrics.'
  private root: BallNode | null = null
  private count = 0
  private nextId = 1
  private nextNode = 1
  public get length(): number { return this.count }
  public static createDefault(): BallTree {
    const model = new BallTree()
    model.root = model.build(PointData.defaults())
    model.count = 10
    model.nextId = 11
    return model
  }
  public clone(): BallTree {
    const copy = new BallTree()
    copy.root = this.root
    copy.count = this.count
    copy.nextId = this.nextId
    copy.nextNode = this.nextNode
    return copy
  }
  private build(points: readonly PointEntry[]): BallNode | null {
    if (!points.length) return null
    const x = points.reduce((sum, point) => sum + point.x, 0) / points.length
    const y = points.reduce((sum, point) => sum + point.y, 0) / points.length
    const radius = Math.max(...points.map((point) => Math.sqrt(PointData.distance(point, { x, y }))))
    const node = { id: this.nextNode++, x, y, radius }
    if (points.length <= 3) return { ...node, points: [...points], children: [] }
    const xSpan = Math.max(...points.map((point) => point.x)) - Math.min(...points.map((point) => point.x))
    const ySpan = Math.max(...points.map((point) => point.y)) - Math.min(...points.map((point) => point.y))
    const axis = xSpan >= ySpan ? 'x' : 'y'
    const sorted = [...points].sort((a, b) => a[axis] - b[axis] || a.id - b.id)
    const middle = Math.floor(points.length / 2)
    return { ...node, points: [], children: [this.build(sorted.slice(0, middle))!, this.build(sorted.slice(middle))!] }
  }
  public getDiagram(): AppliedDiagram {
    const rows: DiagramItem[][] = []
    const visit = (node: BallNode, depth: number): void => {
      rows[depth] ??= []
      rows[depth].push({ id: `ball-${node.id}`, text: `(${node.x.toFixed(1)}, ${node.y.toFixed(1)})`, label: `ball ${node.id} / radius ${node.radius.toFixed(2)}`, children: node.children.length ? node.children.map((child) => `ball-${child.id}`) : node.points.map((point) => `ball-point-${point.id}`) })
      for (const child of node.children) visit(child, depth + 1)
      if (node.points.length) {
        rows[depth + 1] ??= []
        for (const point of node.points) rows[depth + 1].push({ id: `ball-point-${point.id}`, text: `(${point.x}, ${point.y})`, label: `point ${point.id}` })
      }
    }
    if (this.root) visit(this.root, 0)
    return { rows }
  }
  public execute(action: ActionKind, input: LinearInputValues, observer?: LinearObserver): LinearResult {
    if (action === 'inspect-storage') return this.inspect(observer)
    if (action === 'clear') {
      this.root = null
      this.count = 0
      return { description: 'Released all balls and points.' }
    }
    if (action === 'build-values') {
      const parsed = PointData.parse(input.text)
      const points = parsed.map((point, index) => ({ ...point, id: this.nextId + index }))
      this.root = this.build(points)
      this.nextId += points.length
      this.count = points.length
      this.inspect(observer)
      return { description: `Built a ball hierarchy over ${points.length} points.` }
    }
    if (action !== 'nearest-neighbor') throw new RangeError('Unsupported Ball Tree action')
    const query = PointData.read(input)
    let best: PointEntry | null = null
    let distance = Infinity
    const lowerBound = (node: BallNode): number => Math.max(0, Math.sqrt(PointData.distance(node, query)) - node.radius)
    const visit = (node: BallNode): void => {
      const lower = lowerBound(node)
      if (lower > Math.sqrt(distance) + 1e-9) {
        LinearModel.emit(observer, `ball-${node.id}`, 'Prune this ball: its nearest possible point is farther than the current best.', 'max(0, distance(center, query) - radius) > bestDistance')
        return
      }
      LinearModel.emit(observer, `ball-${node.id}`, 'Visit this enclosing ball.', 'visit ball with smallest lower bound first')
      for (const point of node.points) {
        const candidate = PointData.distance(point, query)
        LinearModel.emit(observer, `ball-point-${point.id}`, `Point ${point.id} has squared distance ${candidate}.`, 'compare exact point distance')
        if (candidate < distance || candidate === distance && point.id < (best?.id ?? Infinity)) {
          best = point
          distance = candidate
        }
      }
      const ordered = [...node.children].sort((a, b) => lowerBound(a) - lowerBound(b))
      for (const child of ordered) visit(child)
    }
    if (this.root) visit(this.root)
    const result = best as PointEntry | null
    return { description: result ? `Exact nearest point ${result.id}; squared distance ${distance}.` : 'The Ball Tree is empty.', value: result?.id ?? null, activeId: result ? `ball-point-${result.id}` : null, status: result ? 'NEAREST' : 'EMPTY' }
  }
}
