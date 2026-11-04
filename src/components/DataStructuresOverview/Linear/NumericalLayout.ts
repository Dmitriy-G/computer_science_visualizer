import { NumericalModel } from './NumericalModel.ts'
import { DenseArrayModel } from './DenseArrayModel.ts'
import { LinearScene } from '../../../visualization/LinearScene.ts'
import type { LinearFrame, LinearModel } from '../../../visualization/LinearModel.ts'
import type { Scene, SceneHint, SceneNode } from '../../../visualization/Scene.ts'

// Storage-array geometry only; each canonical model supplies its actual arrays.
export class NumericalLayout {
  public create(model: LinearModel, frame: LinearFrame, hint: SceneHint): Scene {
    if (!(model instanceof NumericalModel)) throw new TypeError('Expected numerical storage')
    const storage = model.getStorage()
    let cellWidth = 160
    for (const row of storage) {
      cellWidth = Math.max(cellWidth, (row.name.length + 4) * 7)
      for (const value of row.values) cellWidth = Math.max(cellWidth, String(value).length * 12 + 24)
    }
    const nodes: SceneNode[] = []
    let y = 110
    for (const row of storage) {
      if (!row.values.length) nodes.push(LinearScene.node(`${model.kind}-${row.name}-empty`, 'empty', `${row.name}[0..0)`, cellWidth / 2 + 30, y, cellWidth))
      for (let index = 0; index < row.values.length; index += 1) {
        let column = index % 8
        let line = Math.floor(index / 8)
        let label = `${row.name}[${index}]`
        if (row.name === 'data' && model instanceof DenseArrayModel) {
          const coordinates = model.getCoordinates(index)
          label = `[${coordinates.join(',')}] / ${index}`
          if (model.kind === 'grid-2d') {
            column = coordinates[1]
            line = coordinates[0]
            label = `r${coordinates[0]} c${coordinates[1]} / ${index}`
          }
        }
        nodes.push(LinearScene.node(`${model.kind}-${row.name}-${index}`, String(row.values[index]), label, cellWidth / 2 + 30 + column * (cellWidth + 24), y + line * 130, cellWidth))
      }
      const lines = row.name === 'data' && model.kind === 'grid-2d' ? model.shape[0] : Math.max(1, Math.ceil(row.values.length / 8))
      y += lines * 130
    }
    return LinearScene.create(model, nodes, [], frame, hint, model instanceof DenseArrayModel ? 'occupied cells' : model.kind === 'sparse-coo' ? 'stored triplets' : 'stored nonzeros')
  }
}
