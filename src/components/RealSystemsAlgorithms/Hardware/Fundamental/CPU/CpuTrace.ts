import type { AnimationStep } from '../../../../../visualization/Scene.ts'
import { CpuLayout } from './CpuLayout.ts'
import { CpuModel } from './CpuModel.ts'

export class CpuTrace {
  public readonly steps: AnimationStep[] = []
  public result = new CpuModel()

  public record(model: CpuModel, title: string, description: string, code: string, phase = 1): void {
    if (this.steps.length >= 96) throw new RangeError('CPU lesson exceeds its event bound')
    const copy = model.clone()
    this.result = new CpuModel(copy.banks, copy.detail, copy.focusId, this.steps.length + 1, copy.diagram)
    const scene = CpuLayout.create(this.result)
    const previous = new Map<string, string>()
    for (const node of this.steps.at(-1)?.scene.nodes ?? []) previous.set(node.id, JSON.stringify([node.displayValue, node.status]))
    let changed = false
    for (const node of scene.nodes) {
      if (previous.get(node.id) !== JSON.stringify([node.displayValue, node.status])) changed = true
    }
    const edges = []
    for (const edge of scene.edges) edges.push(changed ? edge : { ...edge, highlighted: false, flow: false, opacity: 0.45 })
    const nodes = []
    for (const node of scene.nodes) {
      let active = false
      for (const edge of edges) if (edge.highlighted && (edge.from === node.id || edge.to === node.id)) active = true
      nodes.push({ ...node, tone: active ? 'active' as const : node.tone })
    }
    this.steps.push({ phase, title, description, code, duration: 1000, scene: { ...scene, nodes, edges } })
  }
}
