import { NumericalModel } from './NumericalModel.ts'
import type { NumericalStorageRow } from './NumericalModel.ts'
import type { LinearInputValues, LinearObserver, LinearResult } from '../../../visualization/LinearModel.ts'
import type { ActionKind } from '../../../visualization/ActionCatalog.ts'

// Tensor and grid both use real contiguous row-major numeric storage.
export abstract class DenseArrayModel extends NumericalModel {
  protected data = new Float64Array(10)
  protected elementStrides = [5, 1]
  public get length(): number { return this.data.length }
  public get strides(): readonly number[] { return [...this.elementStrides] }
  public getValues(): readonly number[] { return Array.from(this.data) }

  public getStorage(): readonly NumericalStorageRow[] {
    return [{ name: 'shape', values: this.shape }, { name: 'strides', values: this.strides }, { name: 'data', values: this.getValues() }]
  }

  public getCoordinates(offset: number): number[] {
    const coordinates: number[] = []
    for (let axis = 0; axis < this.dimensions.length; axis += 1) coordinates.push(Math.floor(offset / this.elementStrides[axis]) % this.dimensions[axis])
    return coordinates
  }

  protected initialize(): void {
    for (let index = 0; index < this.data.length; index += 1) this.data[index] = (index + 1) * 10
  }

  protected copyTo(model: DenseArrayModel): void {
    model.dimensions = [...this.dimensions]
    model.elementStrides = [...this.elementStrides]
    model.data = this.data.slice()
  }

  private setShape(shape: readonly number[]): void {
    this.dimensions = [...shape]
    this.elementStrides = new Array<number>(shape.length)
    let stride = 1
    for (let axis = shape.length - 1; axis >= 0; axis -= 1) {
      this.elementStrides[axis] = stride
      stride *= shape[axis]
    }
  }

  protected operate(action: ActionKind, input: LinearInputValues, observer?: LinearObserver): LinearResult {
    if (action === 'build-values') {
      const { shape, values } = this.buildInput(input)
      this.setShape(shape)
      this.data = Float64Array.from(values)
      for (let index = 0; index < values.length; index += 1) NumericalModel.emit(observer, `${this.kind}-data-${index}`, `Store ${values[index]} at flat offset ${index}, coordinates [${this.getCoordinates(index).join(', ')}].`, 'data[offset] = values[offset]', 'STORED')
      return { description: `Built ${this.length} occupied cells with shape [${shape.join(', ')}] and element strides [${this.elementStrides.join(', ')}].` }
    }
    if (action === 'reshape' && this.kind === 'dense-tensor') {
      const shape = NumericalModel.list(input.shape, 'Shape', 4)
      if (NumericalModel.validateShape(shape, true) !== this.length) throw new RangeError('Reshape must preserve the number of occupied cells')
      this.setShape(shape)
      NumericalModel.emit(observer, `${this.kind}-shape-0`, `Change shape to [${shape.join(', ')}]; keep the same contiguous storage and value order.`, 'shape = newShape; recompute row-major strides')
      return { description: `Reshaped to [${shape.join(', ')}] without reallocating or reordering the data.` }
    }
    if (action === 'clear') {
      for (let index = 0; index < this.data.length; index += 1) {
        this.data[index] = 0
        NumericalModel.emit(observer, `${this.kind}-data-${index}`, `Set flat offset ${index} to zero; the cell remains allocated.`, 'data[offset] = 0', 'ZERO')
      }
      return { description: `All ${this.length} cells are zero; shape and allocation are preserved.` }
    }
    if (action !== 'search-index' && action !== 'update-index') throw new RangeError('Unsupported dense-array operation')
    const coordinates = this.coordinates(input)
    const value = action === 'update-index' ? NumericalModel.integer(input, 'value') : 0
    let offset = 0
    for (let axis = 0; axis < coordinates.length; axis += 1) {
      offset += coordinates[axis] * this.elementStrides[axis]
      NumericalModel.emit(observer, `${this.kind}-strides-${axis}`, `Axis ${axis}: ${coordinates[axis]} * ${this.elementStrides[axis]}; partial offset ${offset}.`, 'offset += coordinates[axis] * strides[axis]')
    }
    if (action === 'update-index') {
      this.data[offset] = value
      NumericalModel.emit(observer, `${this.kind}-data-${offset}`, `Write ${value} at offset ${offset}.`, 'data[offset] = value', 'STORED')
      return { description: `Stored ${value} at [${coordinates.join(', ')}], flat offset ${offset}.`, activeId: `${this.kind}-data-${offset}`, status: 'STORED' }
    }
    return { description: `[${coordinates.join(', ')}] = ${this.data[offset]}, flat offset ${offset}.`, activeId: `${this.kind}-data-${offset}`, status: 'READ', value: this.data[offset] }
  }
}
