import { CompressedSparseRow } from './CompressedSparseRow.ts'
import { ExtendedGraphLayout } from '../../../../visualization/ExtendedGraphLayout.ts'
import { LinearScene } from '../../../../visualization/LinearScene.ts'
import type { LinearFrame, LinearModel } from '../../../../visualization/LinearModel.ts'
import type { Scene } from '../../../../visualization/Scene.ts'

export class CompressedSparseRowLayout extends ExtendedGraphLayout {
  public create(model: LinearModel, frame: LinearFrame = {}): Scene {
    if (!(model instanceof CompressedSparseRow)) throw new TypeError('Expected CompressedSparseRow')
    const drawing = this.topology(model)
    const start = drawing.right + 120
    const storage = model.getStorage()
    for (let index = 0; index < storage.offsets.length; index += 1) drawing.nodes.push(LinearScene.node(`csr-offset-${index}`, String(storage.offsets[index]), `offsets[${index}]`, start + index * 120, 120, 76))
    for (let index = 0; index < storage.columns.length; index += 1) drawing.nodes.push(LinearScene.node(`csr-column-${index}`, String(storage.columns[index]), `col[${index}] · e${storage.edgeNumbers[index]}`, start + index % 12 * 150, 330 + Math.floor(index / 12) * 140, 90))
    return this.finish(model, drawing, frame)
  }
}
