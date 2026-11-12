import { UnrolledLinkedList } from './UnrolledLinkedList.ts'
import { LinearScene } from '../../../../visualization/LinearScene.ts'
import type { LinearFrame, LinearModel } from '../../../../visualization/LinearModel.ts'
import type { Scene, SceneEdge, SceneNode } from '../../../../visualization/Scene.ts'

export class UnrolledLinkedListLayout {
  public create(model: LinearModel, frame: LinearFrame = {}): Scene {
    if (!(model instanceof UnrolledLinkedList)) throw new TypeError('Expected UnrolledLinkedList')
    const nodes: SceneNode[] = []
    const edges: SceneEdge[] = []
    let index = 0
    let start = 0
    for (const block of model.getBlocks()) {
      nodes.push(LinearScene.node(block.id, block.values.join(' | '), `indices ${start}–${start + block.values.length - 1} · ${block.values.length}/4`, 170 + index * 340, 125, 250))
      if (block.next) edges.push(LinearScene.edge(block.id, block.next.id))
      start += block.values.length
      index += 1
    }
    return LinearScene.create(model, nodes, edges, frame, 'values')
  }
}
