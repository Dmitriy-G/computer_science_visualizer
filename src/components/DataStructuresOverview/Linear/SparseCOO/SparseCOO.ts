import { SparseMatrixModel } from '../SparseMatrixModel.ts'
import type { MatrixEntry } from '../SparseMatrixModel.ts'
import { NumericalModel } from '../NumericalModel.ts'
import type { NumericalStorageRow } from '../NumericalModel.ts'
import type { ActionKind } from '../../../../visualization/ActionCatalog.ts'
import type { LinearInputValues, LinearObserver, LinearResult } from '../../../../visualization/LinearModel.ts'

export class SparseCOO extends SparseMatrixModel {
  public readonly kind = 'sparse-coo'
  private rows: number[] = []
  private columns: number[] = []
  private data: number[] = []
  public get length(): number { return this.data.length }

  public static createDefault(): SparseCOO {
    const model = new SparseCOO()
    model.initialize()
    return model
  }

  public clone(): SparseCOO {
    const model = new SparseCOO()
    model.dimensions = [...this.dimensions]
    model.rows = [...this.rows]
    model.columns = [...this.columns]
    model.data = [...this.data]
    return model
  }

  public getStorage(): readonly NumericalStorageRow[] {
    return [{ name: 'shape', values: this.shape }, { name: 'rows', values: [...this.rows] }, { name: 'columns', values: [...this.columns] }, { name: 'data', values: [...this.data] }]
  }

  public getEntries(): readonly MatrixEntry[] {
    const entries: MatrixEntry[] = []
    for (let offset = 0; offset < this.length; offset += 1) entries.push({ row: this.rows[offset], column: this.columns[offset], value: this.data[offset], offset })
    return entries
  }

  protected build(shape: readonly number[], values: readonly number[]): void {
    this.dimensions = [...shape]
    this.rows = []
    this.columns = []
    this.data = []
    for (let offset = 0; offset < values.length; offset += 1) {
      if (values[offset] === 0) continue
      this.rows.push(Math.floor(offset / shape[1]))
      this.columns.push(offset % shape[1])
      this.data.push(values[offset])
    }
  }

  protected clearStorage(observer?: LinearObserver): void {
    while (this.data.length) {
      const offset = this.data.length - 1
      NumericalModel.emit(observer, `${this.kind}-data-${offset}`, `Release triplet ${offset}; remaining coordinates keep their meaning.`, 'pop rows, columns, data together')
      this.rows.pop()
      this.columns.pop()
      this.data.pop()
    }
  }

  protected read(row: number, column: number, observer?: LinearObserver): LinearResult {
    let sum = 0n
    let found = -1
    for (let offset = 0; offset < this.length; offset += 1) {
      NumericalModel.emit(observer, `${this.kind}-data-${offset}`, `Compare triplet ${offset}: (${this.rows[offset]}, ${this.columns[offset]}) with (${row}, ${column}).`, 'if rows[k] == row and columns[k] == column: sum += data[k]')
      if (this.rows[offset] === row && this.columns[offset] === column) {
        sum += BigInt(this.data[offset])
        found = offset
      }
    }
    const value = sum >= BigInt(Number.MIN_SAFE_INTEGER) && sum <= BigInt(Number.MAX_SAFE_INTEGER) ? Number(sum) : String(sum)
    return { description: `(${row}, ${column}) = ${sum}${found < 0 ? ' (implicit zero)' : ' (sum of matching triplets)'}.`, value, activeId: found < 0 ? `${this.kind}-shape-0` : `${this.kind}-data-${found}`, status: found < 0 ? 'IMPLICIT ZERO' : 'READ' }
  }

  protected set(row: number, column: number, value: number, observer?: LinearObserver): LinearResult {
    let matches = 0
    for (let offset = 0; offset < this.length; offset += 1) {
      NumericalModel.emit(observer, `${this.kind}-data-${offset}`, `Inspect triplet ${offset} before replacing coordinate (${row}, ${column}).`, 'match = rows[k] == row and columns[k] == column')
      if (this.rows[offset] === row && this.columns[offset] === column) matches += 1
    }
    if (this.length - matches + (value === 0 ? 0 : 1) > 64) throw new RangeError('At most 64 COO triplets can be stored')
    const rows: number[] = []
    const columns: number[] = []
    const data: number[] = []
    for (let offset = 0; offset < this.length; offset += 1) {
      if (this.rows[offset] === row && this.columns[offset] === column) continue
      rows.push(this.rows[offset])
      columns.push(this.columns[offset])
      data.push(this.data[offset])
    }
    if (value !== 0) {
      rows.push(row)
      columns.push(column)
      data.push(value)
    }
    this.rows = rows
    this.columns = columns
    this.data = data
    const activeId = value === 0 ? `${this.kind}-shape-0` : `${this.kind}-data-${data.length - 1}`
    NumericalModel.emit(observer, activeId, `Replace all triplets at (${row}, ${column}) with ${value === 0 ? 'implicit zero' : value}.`, 'replace coordinate; omit zero', 'STORED')
    return { description: `(${row}, ${column}) is now ${value}; ${this.length} triplets remain.`, activeId, status: value === 0 ? 'IMPLICIT ZERO' : 'STORED' }
  }

  protected operate(action: ActionKind, input: LinearInputValues, observer?: LinearObserver): LinearResult {
    if (action === 'insert') {
      const [row, column] = this.coordinates(input)
      const value = NumericalModel.integer(input, 'value')
      if (this.length >= 64) throw new RangeError('At most 64 COO triplets can be stored')
      this.rows.push(row)
      this.columns.push(column)
      this.data.push(value)
      const activeId = `${this.kind}-data-${this.length - 1}`
      NumericalModel.emit(observer, activeId, `Append (${row}, ${column}, ${value}); duplicates and explicit zeros are retained.`, 'rows.push(row); columns.push(column); data.push(value)', 'NEW')
      return { description: `Appended triplet ${this.length - 1}. Reads sum duplicate coordinates; Coalesce merges them.`, activeId, status: 'NEW' }
    }
    if (action === 'coalesce') {
      const entries = [...this.getEntries()]
      // Explicit insertion sort makes this small teaching variant's cost unambiguous.
      for (let index = 1; index < entries.length; index += 1) {
        const entry = entries[index]
        let target = index
        NumericalModel.emit(observer, `${this.kind}-data-${entry.offset}`, `Insert a copy of triplet (${entry.row}, ${entry.column}) into the working coordinate order; canonical arrays remain unchanged.`, 'insertion-sort a separate triplet array')
        while (target > 0 && (entries[target - 1].row > entry.row || entries[target - 1].row === entry.row && entries[target - 1].column > entry.column)) {
          entries[target] = entries[target - 1]
          target -= 1
        }
        entries[target] = entry
      }
      const rows: number[] = []
      const columns: number[] = []
      const data: number[] = []
      for (let index = 0; index < entries.length;) {
        const entry = entries[index]
        let sum = 0n
        while (index < entries.length && entries[index].row === entry.row && entries[index].column === entry.column) {
          sum += BigInt(entries[index].value)
          NumericalModel.emit(observer, `${this.kind}-data-${entries[index].offset}`, `Sum (${entry.row}, ${entry.column}) in the working copy: ${sum}.`, 'sum += BigInt(triplet.value); validate before publishing')
          index += 1
        }
        if (sum < BigInt(Number.MIN_SAFE_INTEGER) || sum > BigInt(Number.MAX_SAFE_INTEGER)) throw new RangeError('A coalesced sum exceeds safe-integer storage; the original triplets are preserved')
        if (sum !== 0n) {
          rows.push(entry.row)
          columns.push(entry.column)
          data.push(Number(sum))
        }
      }
      this.rows = rows
      this.columns = columns
      this.data = data
      for (let index = 0; index < data.length; index += 1) NumericalModel.emit(observer, `${this.kind}-data-${index}`, `Coalesced (${rows[index]}, ${columns[index]}) = ${data[index]}.`, 'sort coordinates; sum duplicates; remove zeros', 'COALESCED')
      return { description: `Coalesced to ${data.length} sorted unique nonzero coordinates.` }
    }
    return super.operate(action, input, observer)
  }
}
