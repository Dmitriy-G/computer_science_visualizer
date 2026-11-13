import type { AnimationStep, SceneNode } from '../../../../visualization/Scene.ts'
import { HardwareSceneLayout } from '../../../../visualization/HardwareSceneLayout.ts'
import { HardwareInteractions } from '../../../../visualization/HardwareInteractions.ts'
import { HardwareSnapshot } from './HardwareSnapshot.ts'

export class HardwareTrace {
  public readonly steps: AnimationStep[] = []
  public result = new HardwareSnapshot()

  private readonly kind: 'cpu-hardware' | 'hardware-component'

  constructor(kind: 'cpu-hardware' | 'hardware-component' = 'cpu-hardware') {
    this.kind = kind
  }

  public record(model: HardwareSnapshot, title: string, description: string, code: string, phase = 1): void {
    if (this.kind === 'cpu-hardware') {
      this.recordCore(model, title, description, code, phase)
      return
    }
    if (this.steps.length >= 96) throw new RangeError('Component lesson exceeds its event bound')
    const copy = model.clone()
    this.result = new HardwareSnapshot(copy.banks, copy.focusId, this.steps.length + 1, copy.diagram)
    const scene = HardwareSceneLayout.create(this.result, this.kind)
    const edges = scene.edges
    const nodes = []
    for (const node of scene.nodes) {
      let active = false
      for (const edge of edges) if (edge.highlighted && (edge.from === node.id || edge.to === node.id)) active = true
      nodes.push({ ...node, tone: active ? 'active' as const : node.tone })
    }
    this.steps.push({ phase, title, description, code, duration: 1000, scene: { ...scene, nodes, edges } })
  }

  private recordCore(model: HardwareSnapshot, title: string, description: string, code: string, phase: number): void {
    const copy = model.clone()
    const scene = { ...HardwareSceneLayout.create(copy, 'cpu-hardware'), countLabel: 'diagram interactions' }
    const previous = this.steps.at(-1)?.scene
    if (!previous || phase === 0) {
      const nodes = new Map<string, SceneNode>()
      for (const node of scene.nodes) nodes.set(node.id, node)
      this.steps.push({ phase, title, description, code, duration: 1000,
        scene: { ...HardwareInteractions.frame(scene, nodes, null, null), count: this.steps.length + 1 } })
    } else {
      const interactions = HardwareInteractions.create(previous, scene)
      for (let index = 0; index < interactions.length; index += 1) {
        const interaction = interactions[index]
        const last = index === interactions.length - 1
        this.steps.push({
          phase: phase === 2 && !last ? 1 : phase, title, code, duration: 1000,
          description: `${interaction.description} ${last ? description : title + '.'}`,
          scene: { ...interaction.scene, count: this.steps.length + 1 },
        })
      }
      if (!interactions.length) this.explain(description, phase)
    }
    if (this.steps.length > 256) throw new RangeError('CPU lesson exceeds its interaction bound')
    this.result = new HardwareSnapshot(copy.banks, copy.focusId, this.steps.length, copy.diagram)
  }

  public explain(description: string, phase = 2): void {
    const index = this.steps.length - 1
    const previous = this.steps[index]
    if (!previous) throw new Error('Record an initial hardware state before its explanation')
    this.steps[index] = { ...previous, description: `${previous.description} ${description}`, phase }
  }
}
