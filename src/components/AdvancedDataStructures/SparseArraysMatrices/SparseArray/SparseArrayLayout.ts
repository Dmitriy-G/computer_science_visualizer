import { SparseArray } from './SparseArray.ts'
import { LinearScene } from '../../../../visualization/LinearScene.ts'
import type { LinearFrame, LinearModel } from '../../../../visualization/LinearModel.ts'
import type { Scene, SceneNode } from '../../../../visualization/Scene.ts'

export class SparseArrayLayout {
  public create(model: LinearModel, frame: LinearFrame = {}): Scene {
    if (!(model instanceof SparseArray)) throw new TypeError('Expected SparseArray')
    const nodes: SceneNode[] = [LinearScene.node('sparse-directory', String(model.storedCount), `stored / ${model.length} logical slots`, 170, 110, 220)]
    const entries = [...model.getEntries()]
    entries.sort((first, second) => first[0] - second[0])
    for (let index = 0; index < entries.length; index += 1) {
      nodes.push(LinearScene.node(`sparse-${entries[index][0]}`, String(entries[index][1]), `index ${entries[index][0]}`, 90 + index * 150, 270, 90))
    }
    return LinearScene.create(model, nodes, [], frame, { title: 'Sparse Array', description: 'A Map stores only explicit index/value entries; omitted slots are implicit zero. Setting zero still creates an entry. Deleting an entry does not shift indices or shrink logical length. The diagram sorts stored indices; model lookup uses the Map.' }, 'logical slots')
  }
}
