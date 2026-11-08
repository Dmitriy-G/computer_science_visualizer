import type { Scene } from '../../../../visualization/Scene.ts'
import { HardwareSceneLayout } from '../../../../visualization/HardwareSceneLayout.ts'
import type { HardwareModel } from './HardwareModel.ts'
import { HardwareSystemLayout } from './HardwareSystemLayout.ts'

export class HardwareLayout {
  public static create(model: HardwareModel): Scene {
    if (!model.diagram) return HardwareSceneLayout.create(model, 'hardware-system')
    const scene = HardwareSceneLayout.create({ ...model, diagram: HardwareSystemLayout.create(model.diagram) }, 'hardware-system')
    return { ...scene, hint: {
      title: 'CPU, bus, and memory / logical flow',
      description: `${model.detail} Large boundaries identify CPU cores/private state, the coherent bus/interconnect, and the memory system with RAM backing. Paths show transfers inside each block and through its interfaces. Shared coherent values and PoU state do not necessarily equal RAM contents; these are logical subsystem boundaries, not exact physical chip boundaries or measured transport timing.`,
    } }
  }
}
