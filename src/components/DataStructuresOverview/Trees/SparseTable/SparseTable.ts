import { ExtendedTreeModel } from '../ExtendedTreeModel.ts'
import type { TreeDiagramEntry, TreeInputValues, TreeOperationResult } from '../../../../visualization/AdditionalTreeModel.ts'
import type { ActionKind } from '../../../../visualization/ActionCatalog.ts'
import type { TreeTraceObserver } from '../../../../visualization/TreeTrace.ts'
export class SparseTable extends ExtendedTreeModel {
  public readonly kind = 'sparse-table'
  private values: number[] = []
  private table: number[][] = []
  private logs: number[] = [0, 0]
  private generation = 0
  public get length(): number { return this.values.length }
  public static createDefault(): SparseTable {
    const table = new SparseTable()
    table.execute('build-values', { values: '9,3,7,1,8,2,6,4,10,5' })
    return table
  }
  public clone(): SparseTable {
    const copy = new SparseTable()
    copy.values = [...this.values]
    copy.logs = [...this.logs]
    copy.generation = this.generation
    for (const row of this.table) copy.table.push([...row])
    return copy
  }
  private id(level: number, index: number): string { return `sparse-${this.generation}-${level}-${index}` }
  public getDiagram(): TreeDiagramEntry[] {
    const entries: TreeDiagramEntry[] = []
    for (let level = this.table.length - 1; level >= 0; level -= 1) {
      for (let index = 0; index < this.table[level].length; index += 1) entries.push({ id: this.id(level, index), text: String(this.table[level][index]), label: `k=${level}; [${index}, ${index + 2 ** level - 1}]`, children: [] })
    }
    return entries
  }
  public execute(action: ActionKind, input: TreeInputValues, observer?: TreeTraceObserver): TreeOperationResult {
    if (action === 'clear') {
      this.values = []
      this.table = []
      this.logs = [0, 0]
      this.emit(observer, null, 'Discard all precomputed intervals.', 'table = []', 'remove')
      return { description: 'The sparse table is empty; build new values to query it.' }
    }
    if (action === 'build-values') {
      if (typeof input.values !== 'string') throw new TypeError('Enter comma-separated integers')
      const texts = input.values.split(',')
      if (!texts.length || texts.length > 64) throw new RangeError('Use 1 to 64 values')
      const values: number[] = []
      for (const text of texts) {
        if (!/^-?\d+$/.test(text.trim()) || !Number.isSafeInteger(Number(text))) throw new TypeError('Use comma-separated safe integers')
        values.push(Number(text))
      }
      this.values = values
      this.table = [[...values]]
      this.logs = [0, 0]
      this.generation += 1
      for (let index = 2; index <= values.length; index += 1) this.logs[index] = this.logs[Math.floor(index / 2)] + 1
      for (let level = 1; 2 ** level <= values.length; level += 1) {
        this.table.push([])
        for (let index = 0; index + 2 ** level <= values.length; index += 1) {
          this.table[level].push(Math.min(this.table[level - 1][index], this.table[level - 1][index + 2 ** (level - 1)]))
          this.emit(observer, this.id(level, index), 'Combine two adjacent half-length minima.', 'st[k][i] = min(st[k-1][i], st[k-1][i + 2^(k-1)])', 'connect')
        }
      }
      return { description: `Built a static sparse table for ${values.length} values. This range-query structure is tabular, rather than a node tree.` }
    }
    if (action !== 'range-min') throw new RangeError('Unsupported sparse-table action')
    const minimum = this.index(input, 'minimum')
    const maximum = this.index(input, 'maximum')
    if (minimum > maximum) throw new RangeError('Minimum index exceeds maximum')
    const level = this.logs[maximum - minimum + 1]
    const right = maximum - 2 ** level + 1
    this.emit(observer, this.id(level, minimum), 'Read the left power-of-two block.', 'k = logs[length]; left = st[k][minimum]')
    this.emit(observer, this.id(level, right), 'Read the right block; overlapping minima are safe.', 'right = st[k][maximum - 2^k + 1]')
    const result = Math.min(this.table[level][minimum], this.table[level][right])
    return { description: `Minimum on [${minimum}, ${maximum}] is ${result}, using two cached blocks.`, returnValue: result, activeId: this.id(level, right), status: 'MINIMUM' }
  }
}
