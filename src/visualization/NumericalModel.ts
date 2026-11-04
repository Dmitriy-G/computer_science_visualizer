import { LinearModel } from './LinearModel.ts'
import type { LinearInputValues, LinearObserver, LinearResult } from './LinearModel.ts'
import type { ActionKind } from './ActionCatalog.ts'
import type { NumericalStructureKind } from './NumericalStructureKinds.ts'

export interface NumericalStorageRow {
  readonly name: string
  readonly values: readonly number[]
}

// Shared validation and trace contracts, independent of each storage representation.
export abstract class NumericalModel extends LinearModel {
  public abstract readonly kind: NumericalStructureKind
  protected dimensions: number[] = [2, 5]
  public get shape(): readonly number[] { return [...this.dimensions] }
  public abstract getStorage(): readonly NumericalStorageRow[]

  public static list(value: string | number | undefined, label: string, maximum = 64): number[] {
    if (typeof value !== 'string') throw new TypeError(`${label}: enter comma-separated whole numbers`)
    const parts = value.split(',')
    if (parts.length < 1 || parts.length > maximum) throw new RangeError(`${label}: enter 1 to ${maximum} numbers`)
    const result: number[] = []
    for (const part of parts) {
      if (!/^-?\d+$/.test(part.trim())) throw new TypeError(`${label}: every item must be a whole number`)
      const number = Number(part.trim())
      if (!Number.isSafeInteger(number)) throw new RangeError(`${label}: every item must be a safe integer`)
      result.push(number)
    }
    return result
  }

  public static validateShape(shape: readonly number[], tensor: boolean): number {
    if (shape.length < 1 || shape.length > 4 || !tensor && shape.length !== 2) throw new RangeError(tensor ? 'Tensor rank must be 1 to 4' : 'Enter exactly two dimensions: rows, columns')
    let size = 1
    for (const dimension of shape) {
      if (!Number.isSafeInteger(dimension) || dimension < 1 || dimension > 8) throw new RangeError('Each dimension must be from 1 to 8')
      size *= dimension
    }
    if (size > 64) throw new RangeError('This example supports at most 64 logical cells')
    return size
  }

  public static validateCoordinates(coordinates: readonly number[], shape: readonly number[]): void {
    if (coordinates.length !== shape.length) throw new RangeError(`Enter ${shape.length} coordinates for shape [${shape.join(', ')}]`)
    for (let axis = 0; axis < shape.length; axis += 1) LinearModel.index(coordinates[axis], shape[axis])
  }

  public execute(action: ActionKind, input: LinearInputValues, observer?: LinearObserver): LinearResult {
    try {
      if (action === 'inspect-storage') {
        for (const row of this.getStorage()) {
          for (let index = 0; index < row.values.length; index += 1) {
            LinearModel.emit(observer, `${this.kind}-${row.name}-${index}`, `${row.name}[${index}] = ${row.values[index]}.`, `read ${row.name}[${index}]`)
          }
        }
        return { description: `Shape [${this.dimensions.join(', ')}]; storage inspected without changing values.`, value: JSON.stringify(this.getStorage()) }
      }
      return this.operate(action, input, observer)
    } catch (error) {
      if (!(error instanceof RangeError) && !(error instanceof TypeError)) throw error
      return { description: `Request rejected: ${error.message}.`, status: 'REJECTED' }
    }
  }

  protected coordinates(input: LinearInputValues): number[] {
    const coordinates = NumericalModel.list(input.coordinates, 'Coordinates', 4)
    NumericalModel.validateCoordinates(coordinates, this.dimensions)
    return coordinates
  }

  protected buildInput(input: LinearInputValues): { shape: number[]; values: number[] } {
    const shape = NumericalModel.list(input.shape, 'Shape', 4)
    const size = NumericalModel.validateShape(shape, this.kind === 'dense-tensor')
    const values = NumericalModel.list(input.values, 'Values')
    if (values.length !== size) throw new RangeError(`Enter exactly ${size} row-major values for this shape`)
    return { shape, values }
  }

  protected abstract operate(action: ActionKind, input: LinearInputValues, observer?: LinearObserver): LinearResult
}
