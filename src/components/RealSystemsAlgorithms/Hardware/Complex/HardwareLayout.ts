import type { Scene } from '../../../../visualization/Scene.ts'
import { HardwareSceneLayout } from '../../../../visualization/HardwareSceneLayout.ts'
import type { HardwareModel } from './HardwareModel.ts'
import { HardwareSystemLayout } from './HardwareSystemLayout.ts'

export class HardwareLayout {
  public static create(model: HardwareModel): Scene {
    if (!model.diagram) return HardwareSceneLayout.create(model, 'hardware-system')
    return HardwareSceneLayout.create({ ...model, diagram: HardwareSystemLayout.create(model.diagram) }, 'hardware-system')
  }
}
