import type { ActionDefinition, ActionPlan } from '../../../../visualization/ActionDefinition.ts'
import type { AlgorithmInformation } from '../../../../visualization/AlgorithmInformation.ts'
import type { AnimationStep, SceneNode } from '../../../../visualization/Scene.ts'
import { HardwareLayout } from './HardwareLayout.ts'
import { HardwareModel } from './HardwareModel.ts'
import { HardwareInteractions } from './HardwareInteractions.ts'

export class HardwareTrace {
  public readonly steps: AnimationStep[] = []
  public result = new HardwareModel()

  public record(model: HardwareModel, title: string, description: string, code: string, phase = 1): void {
    const copy = model.clone()
    const scene = { ...HardwareLayout.create(copy), countLabel: 'diagram interactions' }
    const previous = this.steps.at(-1)?.scene
    if (!previous || phase === 0) {
      const nodes = new Map<string, SceneNode>()
      for (const node of scene.nodes) nodes.set(node.id, node)
      this.steps.push({ phase, title, description, code, duration: 1100,
        scene: { ...HardwareInteractions.frame(scene, nodes, null, null), count: this.steps.length + 1 } })
    } else {
      const interactions = HardwareInteractions.create(previous, scene)
      for (let index = 0; index < interactions.length; index += 1) {
        const interaction = interactions[index]
        const last = index === interactions.length - 1
        this.steps.push({
          phase: phase === 2 && !last ? 1 : phase,
          title, code, duration: 1100,
          description: `${interaction.description} ${last ? description : title + '.'}`,
          scene: { ...interaction.scene, count: this.steps.length + 1 },
        })
      }
      if (!interactions.length) this.explain(description, phase)
    }
    if (this.steps.length > 256) throw new RangeError('Hardware lesson exceeds its interaction bound')
    this.result = new HardwareModel(copy.banks, copy.detail, copy.focusId, this.steps.length, copy.diagram)
  }

  public explain(description: string, phase?: number): void {
    const index = this.steps.length - 1
    const previous = this.steps[index]
    if (!previous) throw new Error('Record an initial hardware state before its explanation')
    this.steps[index] = { ...previous, description: `${previous.description} ${description}`, phase: phase ?? previous.phase }
  }
}

export abstract class HardwareLesson implements ActionDefinition<HardwareModel> {
  public abstract readonly title: string
  public readonly context = 'Hardware / Complex'
  public readonly summary = 'A bounded instruction trace through interacting hardware components.'
  public readonly phases = ['Initial state', 'Hardware events', 'Result']
  public readonly timelineHint = 'One diagram interaction per step, not processor cycles'
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
