import type { NodeTone, SceneEdge, ScenePath, SceneRegion } from './Scene.ts'

export interface HardwareVisualCell {
  readonly id: string
  readonly label: string
  readonly value: string
  readonly status?: string
  readonly tone?: NodeTone
}

export interface HardwarePosition {
  readonly id: string
  readonly x: number
  readonly y: number
  readonly width: number
}

export class HardwareDiagram {
  public readonly regions: SceneRegion[] = []
  public readonly positions: HardwarePosition[] = []
  public readonly fixtures: HardwareVisualCell[] = []
  public readonly edges: SceneEdge[] = []
  public readonly paths: ScenePath[] = []
  public readonly width: number
  public readonly height: number

  constructor(width = 960, height = 560) {
    this.width = width
    this.height = height
  }

  public region(id: string, label: string, role: SceneRegion['role'], x: number, y: number, width: number, height: number, level: SceneRegion['level'] = 'component', parentId?: string, shortLabel?: string): this {
    const region: SceneRegion = { id, label, role, x, y, width, height, level, parentId }
    this.regions.push(shortLabel ? { ...region, shortLabel } : region)
    return this
  }

  public place(id: string, x: number, y: number, width = 180): this {
    this.positions.push({ id, x, y, width })
    return this
  }

  public fixture(id: string, label: string, value: string, x: number, y: number, status?: string, width = 180): this {
    this.fixtures.push({ id, label, value, status })
    return this.place(id, x, y, width)
  }

  public connect(id: string, from: string, to: string, label: string, active = false, curveOffset = 0, message?: string): this {
    this.edges.push({ id, from, to, label, message, highlighted: active, flow: active, curveOffset, directed: true, opacity: active ? 1 : 0.45 })
    return this
  }

  public clone(): HardwareDiagram {
    const copy = new HardwareDiagram(this.width, this.height)
    for (const region of this.regions) copy.regions.push({ ...region })
    for (const position of this.positions) copy.positions.push({ ...position })
    for (const fixture of this.fixtures) copy.fixtures.push({ ...fixture })
    for (const edge of this.edges) copy.edges.push({ ...edge })
    for (const path of this.paths) copy.paths.push({ ...path })
    return copy
  }
}
