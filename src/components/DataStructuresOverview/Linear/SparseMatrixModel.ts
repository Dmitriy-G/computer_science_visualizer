import { NumericalModel } from './NumericalModel.ts'
import type { LinearInputValues, LinearObserver, LinearResult } from '../../../visualization/LinearModel.ts'
import type { ActionKind } from '../../../visualization/ActionCatalog.ts'

export interface MatrixEntry {
  readonly row: number
  readonly column: number
  readonly value: number
  readonly offset: number
}

export abstract class SparseMatrixModel extends NumericalModel {
  public abstract getEntries(): readonly MatrixEntry[]
  protected abstract build(shape: readonly number[], values: readonly number[]): void
  protected abstract clearStorage(observer?: LinearObserver): void
  protected abstract read(row: number, column: number, observer?: LinearObserver): LinearResult
  protected abstract set(row: number, column: number, value: number, observer?: LinearObserver): LinearResult

  protected initialize(): void {
    const values = [1, 0, 2, 0, 3, 0, 4, 0, 5, 0, 6, 0, 7, 0, 8, 0, 9, 0, 10, 0]
    this.build([4, 5], values)
  }

  protected operate(action: ActionKind, input: LinearInputValues, observer?: LinearObserver): LinearResult {
    if (action === 'build-values') {
      const { shape, values } = this.buildInput(input)
      this.build(shape, values)
      for (const entry of this.getEntries()) NumericalModel.emit(observer, `${this.kind}-data-${entry.offset}`, `Store ${entry.value} at (${entry.row}, ${entry.column}), packed position ${entry.offset}.`, 'pack nonzero values into canonical storage', 'STORED')
      return { description: `Built a ${shape[0]} by ${shape[1]} numerical matrix with ${this.length} stored nonzeros; omitted coordinates read as zero.` }
    }
    if (action === 'clear') {
      this.clearStorage(observer)
      return { description: `All entries are now implicit zero; matrix shape [${this.dimensions.join(', ')}] is preserved.` }
    }
    if (action === 'multiply-vector') {
      const vector = NumericalModel.list(input.vector, 'Vector', 8)
      if (vector.length !== this.dimensions[1]) throw new RangeError(`Enter ${this.dimensions[1]} vector values, one per matrix column`)
      const sums: bigint[] = new Array<bigint>(this.dimensions[0]).fill(0n)
      for (const entry of this.getEntries()) {
        sums[entry.row] += BigInt(entry.value) * BigInt(vector[entry.column])
        NumericalModel.emit(observer, `${this.kind}-data-${entry.offset}`, `y[${entry.row}] += ${entry.value} * ${vector[entry.column]} = ${sums[entry.row]}.`, 'y[row] += BigInt(data[k]) * BigInt(x[column])', 'ACCUMULATE')
      }
      const output: string[] = []
      for (const sum of sums) output.push(String(sum))
      return { description: `A * x = [${output.join(', ')}]; exact integer products and sums, with the matrix unchanged.`, value: `[${output.join(', ')}]` }
    }
    if (action !== 'search-index' && action !== 'update-index') throw new RangeError('Unsupported sparse-matrix operation')
    const [row, column] = this.coordinates(input)
    if (action === 'search-index') return this.read(row, column, observer)
    const value = NumericalModel.integer(input, 'value')
    return this.set(row, column, value, observer)
  }
}
