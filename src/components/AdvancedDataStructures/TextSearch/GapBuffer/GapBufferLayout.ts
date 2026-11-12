import { GapBuffer } from './GapBuffer.ts'
import { LinearScene } from '../../../../visualization/LinearScene.ts'
import type { LinearFrame, LinearModel } from '../../../../visualization/LinearModel.ts'
import type { Scene, SceneNode } from '../../../../visualization/Scene.ts'

export class GapBufferLayout {
  public create(model: LinearModel, frame: LinearFrame = {}): Scene {
    if (!(model instanceof GapBuffer)) throw new TypeError('Expected GapBuffer')
    const nodes: SceneNode[] = []
    const slots = model.getSlots()
    for (let index = 0; index < slots.length; index += 1) {
      const slot = slots[index]
      const logical = index < model.gapStart ? index : index - (model.gapEnd - model.gapStart)
      nodes.push(LinearScene.node(slot?.id ?? `gap-slot-${index}`, slot ? slot.character === ' ' ? '␣' : slot.character : '·', slot ? `${index} · text ${logical}` : `${index} · GAP`, 80 + index * 115))
    }
    return LinearScene.create(model, nodes, [], frame, 'characters')
  }
}
