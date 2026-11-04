import { SparseMatrixModel } from './SparseMatrixModel.ts'
import type { MatrixEntry } from './SparseMatrixModel.ts'
import { NumericalModel } from './NumericalModel.ts'
import type { NumericalStorageRow } from './NumericalModel.ts'
import type { LinearObserver, LinearResult } from '../../../visualization/LinearModel.ts'

// CSC and CSR share the actual compressed-major-axis algorithm, with opposite axes.
export abstract class CompressedMatrixModel extends SparseMatrixModel {
  protected abstract readonly columnMajor: boolean
  protected pointers: number[] = [0, 0, 0]
  protected indices: number[] = []
  protected data: number[] = []
  public get length(): number { return this.data.length }
  public get pointerName(): string { return this.columnMajor ? 'columnPointers' : 'rowPointers' }
  public get indexName(): string { return this.columnMajor ? 'rowIndices' : 'columnIndices' }

  public getStorage(): readonly NumericalStorageRow[] {
    return [{ name: 'shape', values: this.shape }, { name: this.pointerName, values: [...this.pointers] }, { name: this.indexName, values: [...this.indices] }, { name: 'data', values: [...this.data] }]
  }

  public getEntries(): readonly MatrixEntry[] {
    const entries: MatrixEntry[] = []
    for (let major = 0; major + 1 < this.pointers.length; major += 1) {
      for (let offset = this.pointers[major]; offset < this.pointers[major + 1]; offset += 1) entries.push({ row: this.columnMajor ? this.indices[offset] : major, column: this.columnMajor ? major : this.indices[offset], value: this.data[offset], offset })
    }
    return entries
  }

  protected copyTo(model: CompressedMatrixModel): void {
    model.dimensions = [...this.dimensions]
    model.pointers = [...this.pointers]
    model.indices = [...this.indices]
    model.data = [...this.data]
  }

  protected build(shape: readonly number[], values: readonly number[]): void {
    this.dimensions = [...shape]
    this.pointers = [0]
    this.indices = []
    this.data = []
    const majorCount = shape[this.columnMajor ? 1 : 0]
    const minorCount = shape[this.columnMajor ? 0 : 1]
    for (let major = 0; major < majorCount; major += 1) {
      for (let minor = 0; minor < minorCount; minor += 1) {
        const value = values[this.columnMajor ? minor * shape[1] + major : major * shape[1] + minor]
        if (value === 0) continue
        this.indices.push(minor)
        this.data.push(value)
      }
      this.pointers.push(this.data.length)
    }
  }

  protected clearStorage(observer?: LinearObserver): void {
    this.indices = []
    this.data = []
    this.pointers.fill(0)
    for (let index = 0; index < this.pointers.length; index += 1) NumericalModel.emit(observer, `${this.kind}-${this.pointerName}-${index}`, `Reset ${this.pointerName}[${index}] to zero.`, 'drop packed arrays; fill pointers with zero', 'ZERO')
  }

  private locate(row: number, column: number, observer?: LinearObserver): { major: number; minor: number; offset: number; found: boolean } {
    const major = this.columnMajor ? column : row
    const minor = this.columnMajor ? row : column
    let low = this.pointers[major]
    let high = this.pointers[major + 1]
    NumericalModel.emit(observer, `${this.kind}-${this.pointerName}-${major}`, `Search packed interval [${low}, ${high}) for ${this.columnMajor ? 'row' : 'column'} ${minor}.`, 'lo = pointers[major]; hi = pointers[major + 1]')
    while (low < high) {
      const middle = Math.floor((low + high) / 2)
      NumericalModel.emit(observer, `${this.kind}-${this.indexName}-${middle}`, `Compare minor index ${this.indices[middle]} with ${minor}.`, 'if indices[mid] < minor: lo = mid + 1; else: hi = mid')
      if (this.indices[middle] < minor) low = middle + 1
      else high = middle
    }
    return { major, minor, offset: low, found: low < this.pointers[major + 1] && this.indices[low] === minor }
  }

  protected read(row: number, column: number, observer?: LinearObserver): LinearResult {
    const { major, offset, found } = this.locate(row, column, observer)
    const value = found ? this.data[offset] : 0
    return { description: `(${row}, ${column}) = ${value}${found ? ` at packed position ${offset}` : ' (implicit zero)'}.`, value, activeId: found ? `${this.kind}-data-${offset}` : `${this.kind}-${this.pointerName}-${major}`, status: found ? 'READ' : 'IMPLICIT ZERO' }
  }

  protected set(row: number, column: number, value: number, observer?: LinearObserver): LinearResult {
    const { major, minor, offset, found } = this.locate(row, column, observer)
    let delta = 0
    if (found && value !== 0) this.data[offset] = value
    else if (found) {
      this.indices.splice(offset, 1)
      this.data.splice(offset, 1)
      delta = -1
    } else if (value !== 0) {
      this.indices.splice(offset, 0, minor)
      this.data.splice(offset, 0, value)
      delta = 1
    }
    if (delta !== 0) {
      for (let index = major + 1; index < this.pointers.length; index += 1) this.pointers[index] += delta
      for (let index = major + 1; index < this.pointers.length; index += 1) NumericalModel.emit(observer, `${this.kind}-${this.pointerName}-${index}`, `Packed suffix shifted by ${delta}; ${this.pointerName}[${index}] is now ${this.pointers[index]}.`, 'splice aligned indices/data; adjust subsequent pointers')
    }
    const activeId = value === 0 ? `${this.kind}-${this.pointerName}-${major}` : `${this.kind}-data-${offset}`
    NumericalModel.emit(observer, activeId, `Set (${row}, ${column}) to ${value}; sorted minor indices and pointer boundaries are consistent.`, 'store nonzero or remove coordinate for zero', 'STORED')
    return { description: `(${row}, ${column}) is now ${value}; ${this.length} numerical nonzeros remain stored.`, activeId, status: value === 0 ? 'IMPLICIT ZERO' : 'STORED' }
  }
}
