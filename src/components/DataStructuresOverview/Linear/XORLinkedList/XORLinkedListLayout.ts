import { XORLinkedList } from './XORLinkedList.ts'
import { LinearScene } from '../../../../visualization/LinearScene.ts'
import type { LinearFrame, LinearModel } from '../../../../visualization/LinearModel.ts'
import type { Scene, SceneEdge, SceneNode } from '../../../../visualization/Scene.ts'

export class XORLinkedListLayout {
  public create(model: LinearModel, frame: LinearFrame = {}): Scene {
    if (!(model instanceof XORLinkedList)) throw new TypeError('Expected XORLinkedList')
    const nodes: SceneNode[] = []
    const edges: SceneEdge[] = []
    const entries = model.getNodes()
    for (let index = 0; index < entries.length; index += 1) {
      const entry = entries[index]
      nodes.push(LinearScene.node(`xor-${entry.address}`, String(entry.value), `addr ${entry.address} · XOR ${entry.link}${index === 0 ? ' · HEAD' : ''}${index === entries.length - 1 ? ' · TAIL' : ''}`, 130 + index * 265, 125, 120))
      if (index) edges.push(LinearScene.edge(`xor-${entries[index - 1].address}`, `xor-${entry.address}`, 'decoded next'))
    }
    return LinearScene.create(model, nodes, edges, frame, { title: 'Simulated XOR Linked List', description: 'Each node stores previous-address XOR next-address; traversal also carries the previous address. Addresses are stable numeric IDs in a Map, with 0 as null. These are not JavaScript memory pointers, and this simulation does not save memory.' })
  }
}
