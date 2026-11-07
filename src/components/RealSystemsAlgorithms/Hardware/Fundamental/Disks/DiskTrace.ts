import type { AnimationStep } from '../../../../../visualization/Scene.ts'
import { DiskLayout } from './DiskLayout.ts'
import type { DiskWorkload } from './DiskWorkload.ts'

export class DiskTrace {
  public readonly steps: AnimationStep[] = []

  public record(model: DiskWorkload, title: string, description: string, code: string, detail: string, focusId: string | null = null): void {
    if (this.steps.length >= 96) throw new Error('Disk trace exceeds its bounded workload')
    this.steps.push({
      phase: model.completed.length === model.requests.length ? 2 : 1,
      title, description, code, duration: 850,
      scene: DiskLayout.create(model, detail, focusId),
    })
  }

  public finish(model: DiskWorkload): void {
    this.record(model, 'All requests completed',
      `${model.completed.length} requests completed in ${model.time} virtual ticks.`,
      `completed = [${model.completed.join(', ')}]`,
      `Dispatch order: ${model.dispatched.join(' → ') || 'empty'}. Virtual ticks describe this simulated device, not measured hardware performance.`)
  }
}
