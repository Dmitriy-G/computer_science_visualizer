import type { AnimationStep } from '../../../../../visualization/Scene.ts'
import { CpuLayout } from './CpuLayout.ts'
import { CpuModel } from './CpuModel.ts'

export class CpuTrace {
  public readonly steps: AnimationStep[] = []
  public result = new CpuModel()

  public record(model: CpuModel, title: string, description: string, code: string, phase = 1): void {
    if (this.steps.length >= 96) throw new RangeError('CPU lesson exceeds its event bound')
    this.result = new CpuModel(model.clone().banks, model.detail, model.focusId, this.steps.length + 1)
    this.steps.push({ phase, title, description, code, duration: 1000, scene: CpuLayout.create(this.result) })
  }
}
