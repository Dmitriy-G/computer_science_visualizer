import type { Scene } from '../../../../visualization/Scene.ts'
import { HardwareSceneLayout } from '../../../../visualization/HardwareSceneLayout.ts'
import type { CpuModel } from './CpuModel.ts'

export class CpuLayout {
  public static create(model: CpuModel): Scene {
    return HardwareSceneLayout.create(model, 'cpu-hardware')
  }
}
