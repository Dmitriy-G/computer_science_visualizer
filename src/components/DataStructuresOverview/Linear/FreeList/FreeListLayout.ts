import { FreeList } from './FreeList.ts'
import { LinearScene } from '../../../../visualization/LinearScene.ts'
import type { LinearFrame, LinearModel } from '../../../../visualization/LinearModel.ts'
import type { Scene, SceneEdge, SceneNode } from '../../../../visualization/Scene.ts'

export class FreeListLayout {
  public create(model: LinearModel, frame: LinearFrame = {}): Scene {
    if (!(model instanceof FreeList)) throw new TypeError('Expected FreeList')
    const nodes: SceneNode[] = []
    const edges: SceneEdge[] = []
    for (const slot of model.getSlots()) {
      nodes.push(LinearScene.node(`pool-${slot.id}`, slot.value === null ? 'FREE' : String(slot.value), `slot ${slot.id}${slot.id === model.freeHead ? ' · FREE HEAD' : ''}${slot.value !== null ? ' · ALLOCATED' : ''}`, 120 + slot.id * 235, slot.value === null ? 290 : 110, 110))
      if (slot.value === null && slot.next !== null) {
        const edge = LinearScene.edge(`pool-${slot.id}`, `pool-${slot.next}`, 'free next')
        edges.push({ ...edge, curveOffset: slot.next < slot.id ? 85 : 0 })
      }
    }
    return LinearScene.create(model, nodes, edges, frame, { title: 'Free List', description: 'A fixed pool of ten simulated slots. Allocation removes the free-chain head; release pushes a slot onto it. Allocated slots are above free slots. Exhaustion and double release are rejected. This models pool bookkeeping, not native memory allocation.' }, 'allocated slots')
  }
}
