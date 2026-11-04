import { Grid2D } from './Grid2D.ts'
import { NumericalLayout } from '../../../../visualization/NumericalLayout.ts'
import type { LinearFrame, LinearModel } from '../../../../visualization/LinearModel.ts'
import type { Scene } from '../../../../visualization/Scene.ts'

export class Grid2DLayout {
  public create(model: LinearModel, frame: LinearFrame = {}): Scene {
    if (!(model instanceof Grid2D)) throw new TypeError('Expected Grid2D')
    return new NumericalLayout().create(model, frame, { title: '2D Grid', description: 'A fixed rectangular row-major Float64Array stores every grid cell. Coordinates are zero-based row, column; offset = row * columns + column. Cell spacing represents discrete adjacency. This general spatial grid does not implement world-coordinate transforms, navigation layers, or costmap policies.' })
  }
}
