import type { HardwareDiagram } from '../../../../visualization/HardwareDiagram.ts'
import type { Scene, SceneLayer } from '../../../../visualization/Scene.ts'
import { HardwareSnapshot } from './HardwareSnapshot.ts'
import { HardwareTrace } from './HardwareTrace.ts'

export class ComponentFlowTrace extends HardwareTrace {
  private readonly diagram: HardwareDiagram
  private readonly values = new Map<string, string>()

  constructor(diagram: HardwareDiagram, states: readonly (readonly [string, string])[]) {
    super('hardware-component')
    this.diagram = diagram.clone()
    for (const [id, value] of states) this.values.set(id, value)
  }

  public start(description: string): void { this.capture('Initial state', description, null, null, false, 0) }

  public transfer(path: string, destination: string, value: string, title: string, description: string, reverse = false): void {
    const connection = this.diagram.paths.find((candidate) => candidate.id === path)
    if (!connection || reverse && !connection.bidirectional) throw new Error(`Invalid component transfer: ${path}`)
    this.update(destination, value)
    this.capture(title, description, path, destination, reverse)
  }

  public local(destination: string, value: string, title: string, description: string): void {
    this.update(destination, value)
    this.capture(title, description, null, destination)
  }

  public finish(title: string, description: string): void { this.capture(title, description, null, null, false, 2) }

  public static present(scene: Scene, preview: Scene, componentLayer: string): Scene {
    const layers: SceneLayer[] = []
    for (const layer of preview.layers ?? []) layers.push(layer.id === componentLayer ? { ...layer, scene } : layer)
    return { ...preview, layers }
  }

  protected decorateDiagram(_diagram: HardwareDiagram): void {}

  private update(id: string, value: string): void {
    if (!this.values.has(id)) throw new Error(`Missing component state: ${id}`)
    this.values.set(id, value)
  }

  private capture(title: string, description: string, pathId: string | null, focus: string | null, reverse = false, phase = 1): void {
    const diagram = this.diagram.clone()
    for (const [id, value] of this.values) {
      const region = diagram.regions.find((candidate) => candidate.id === id)
      if (!region) throw new Error(`Missing component region: ${id}`)
      diagram.fixture(`${id}-state`, '', value, region.x + region.width / 2, region.y + region.height - 30, '', region.width - 40, 28)
    }
    for (let index = 0; index < diagram.paths.length; index += 1) {
      const path = diagram.paths[index]
      if (path.id !== pathId) continue
      diagram.paths[index] = { ...path, d: reverse ? this.reverse(path.d) : path.d, directed: true, bidirectional: false, highlighted: true, label: `${title}: ${description}` }
    }
    this.decorateDiagram(diagram)
    this.record(new HardwareSnapshot([], focus ? `${focus}-state` : null, 0, diagram), title, description, '', phase)
    const index = this.steps.length - 1
    const step = this.steps[index]
    this.steps[index] = { ...step, scene: { ...step.scene, activity: `${title}: ${description}` } }
  }

  private reverse(path: string): string {
    const tokens = path.match(/[MHV]|-?\d+(?:\.\d+)?/g) ?? []
    const points: { x: number, y: number }[] = []
    let x = 0
    let y = 0
    for (let index = 0; index < tokens.length;) {
      const command = tokens[index++]
      if (command === 'M') {
        x = Number(tokens[index++])
        y = Number(tokens[index++])
      }
      else if (command === 'H') x = Number(tokens[index++])
      else if (command === 'V') y = Number(tokens[index++])
      else throw new Error('Component paths must use absolute M, H, and V commands')
      points.push({ x, y })
    }
    let result = ''
    for (let index = points.length - 1; index >= 0; index -= 1) result += `${index === points.length - 1 ? 'M' : 'L'}${points[index].x} ${points[index].y}`
    return result
  }
}
