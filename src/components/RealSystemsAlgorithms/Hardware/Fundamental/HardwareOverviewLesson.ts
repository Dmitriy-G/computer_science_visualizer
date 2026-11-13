import type { ActionDefinition, ActionPlan } from '../../../../visualization/ActionDefinition.ts'
import type { AnimationStep } from '../../../../visualization/Scene.ts'
import type { HardwareSnapshot } from './HardwareSnapshot.ts'
import type { HardwareTrace } from './HardwareTrace.ts'

export abstract class HardwareOverviewLesson implements ActionDefinition<HardwareSnapshot> {
  public abstract readonly title: string
  protected abstract build(trace: HardwareTrace): void

  protected abstract createTrace(): HardwareTrace

  public create(_source: HardwareSnapshot): ActionPlan<HardwareSnapshot> {
    const trace = this.createTrace()
    this.build(trace)
    let width = 745
    let height = 250
    for (const step of trace.steps) {
      width = Math.max(width, step.scene.width)
      height = Math.max(height, step.scene.height)
    }
    const steps: AnimationStep[] = []
    for (const step of trace.steps) steps.push({ ...step, scene: { ...step.scene, width, height } })
    return { steps, result: trace.result.clone() }
  }
}
