import type { ActionDefinition, ActionPlan } from '../../../../visualization/ActionDefinition.ts'
import type { AlgorithmInformation } from '../../../../visualization/AlgorithmInformation.ts'
import type { AnimationStep } from '../../../../visualization/Scene.ts'
import { HardwareLayout } from './HardwareLayout.ts'
import { HardwareModel } from './HardwareModel.ts'

export class HardwareTrace {
  public readonly steps: AnimationStep[] = []
  public result = new HardwareModel()

  public record(model: HardwareModel, title: string, description: string, code: string, phase = 1): void {
    if (this.steps.length >= 96) throw new RangeError('Hardware lesson exceeds its event bound')
    const previous = new Map<string, string>()
    for (const bank of this.result.banks) {
      for (const cell of bank.cells) previous.set(cell.id, JSON.stringify([cell.value, cell.status]))
    }
    for (const cell of this.result.diagram?.fixtures ?? []) previous.set(cell.id, JSON.stringify([cell.value, cell.status]))
    const copy = model.clone()
    this.result = new HardwareModel(copy.banks, copy.detail, copy.focusId, this.steps.length + 1, copy.diagram)
    const scene = HardwareLayout.create(this.result)
    const changed = new Set<string>()
    for (const bank of copy.banks) {
      for (const cell of bank.cells) {
        if (previous.get(cell.id) !== JSON.stringify([cell.value, cell.status])) changed.add(cell.id)
      }
    }
    for (const cell of copy.diagram?.fixtures ?? []) {
      if (previous.get(cell.id) !== JSON.stringify([cell.value, cell.status])) changed.add(cell.id)
    }
    let focusId = model.focusId
    const edges = []
    for (const edge of scene.edges) {
      edges.push(changed.size ? edge : { ...edge, highlighted: false, flow: false, opacity: 0.45 })
    }
    const nodes = []
    for (const node of scene.nodes) {
      let current = phase !== 0 && changed.has(node.id)
      for (const edge of edges) {
        if (edge.highlighted && (edge.from === node.id || edge.to === node.id)) current = true
      }
      if (current && focusId === null) focusId = node.id
      nodes.push({ ...node, tone: current ? 'active' as const : node.tone })
    }
    this.steps.push({ phase, title, description, code, duration: 1100, scene: { ...scene, nodes, edges, focusId } })
  }
}

export abstract class HardwareLesson implements ActionDefinition<HardwareModel> {
  public abstract readonly title: string
  public readonly context = 'Hardware / Complex'
  public readonly summary = 'A bounded instruction trace through interacting hardware components.'
  public readonly phases = ['Initial state', 'Hardware events', 'Result']
  public readonly timelineHint = 'Deterministic events, not processor cycles'
  protected abstract build(trace: HardwareTrace): void

  public create(_source: HardwareModel): ActionPlan<HardwareModel> {
    const trace = new HardwareTrace()
    this.build(trace)
    let height = 250
    let width = 720
    for (const step of trace.steps) {
      height = Math.max(height, step.scene.height)
      width = Math.max(width, step.scene.width)
    }
    const steps: AnimationStep[] = []
    for (const step of trace.steps) steps.push({ ...step, scene: { ...step.scene, width, height } })
    return { steps, result: trace.result.clone() }
  }
}

export class HardwareInformation {
  public static readonly intel = 'https://cdrdv2-public.intel.com/835754/253668-sdm-vol-3a.pdf'
  public static readonly arm = 'https://documentation-service.arm.com/static/62b4777131ea212bb66241e6'
  public static readonly lse = 'https://learn.arm.com/learning-paths/servers-and-cloud-computing/lse/intro/'

  public static create(name: string, summary: string, technology: string, url: string, usage: string, limits: string): AlgorithmInformation {
    const bound = { best: 'O(1)', average: 'O(1)', worst: 'O(1)' }
    return {
      name, summary, modelNotes: limits,
      time: { ...bound, explanation: 'Fixed, bounded teaching example. This is the visualizer cost, not a hardware latency, throughput, or contention bound.' },
      memory: { ...bound, explanation: 'Fixed-size mechanism state, excluding recorded scenes and playback clones. This is not a production hardware storage bound.' },
      terms: [
        { symbol: 'O(1)', meaning: 'Constant cost for this fixed-size teaching example; not a bound on real processor latency or contention.' },
      ],
      realWorldUsage: { technologies: [{ name: technology, url, usage }], products: [], note: limits },
    }
  }
}
