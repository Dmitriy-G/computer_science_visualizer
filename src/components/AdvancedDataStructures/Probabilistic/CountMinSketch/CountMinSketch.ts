import { ProbabilisticModel } from '../ProbabilisticModel.ts'
import { ProbabilisticHash } from '../../../../visualization/ProbabilisticHash.ts'
import type { ActionKind } from '../../../../visualization/ActionCatalog.ts'
import type { LinearInputValues, LinearObserver, LinearResult } from '../../../../visualization/LinearModel.ts'

export class CountMinSketch extends ProbabilisticModel {
  public readonly kind = 'count-min-sketch' as const
  private counters: bigint[][] = Array.from({ length: 3 }, () => new Array<bigint>(8).fill(0n))
  private total = 0n

  public static createDefault(): CountMinSketch {
    const model = new CountMinSketch()
    for (let value = 10; value <= 100; value += 10) model.execute('insert', { value, weight: 1 })
    return model
  }

  public getCounters(): readonly (readonly bigint[])[] { return this.counters.map((row) => [...row]) }
  public get totalWeight(): bigint { return this.total }
  public columns(value: number): readonly number[] { return [0, 1, 2].map((row) => ProbabilisticHash.index(value, row, 8)) }

  public clone(): CountMinSketch {
    const copy = new CountMinSketch()
    copy.count = this.count
    copy.total = this.total
    copy.counters = this.counters.map((row) => [...row])
    return copy
  }

  public execute(action: ActionKind, input: LinearInputValues, observer?: LinearObserver): LinearResult {
    if (action === 'clear') {
      for (let row = 0; row < 3; row += 1) {
        this.counters[row].fill(0n)
        CountMinSketch.emit(observer, `cms-${row}-0`, `Clear row ${row}.`, 'C[row].fill(0)')
      }
      this.count = 0
      this.total = 0n
      return { description: 'All sketch counters and the total weight are zero.' }
    }
    if (action !== 'insert' && action !== 'search-value') throw new RangeError('Unsupported Count-Min operation')
    const value = CountMinSketch.integer(input, 'value')
    const columns = this.columns(value)
    let weight = 0n
    if (action === 'insert') {
      const amount = CountMinSketch.integer(input, 'weight')
      if (amount <= 0) throw new RangeError('Weight must be a positive safe integer')
      if (this.count === Number.MAX_SAFE_INTEGER) return this.rejected('The update counter reached its safe-integer limit.')
      weight = BigInt(amount)
    }
    let minimum: bigint | null = null
    for (let row = 0; row < 3; row += 1) {
      const column = columns[row]
      if (action === 'insert') this.counters[row][column] += weight
      const counter = this.counters[row][column]
      if (minimum === null || counter < minimum) minimum = counter
      CountMinSketch.emit(observer, `cms-${row}-${column}`, `${action === 'insert' ? 'Increment' : 'Read'} row ${row}, column ${column}: ${counter}.`, action === 'insert' ? 'C[row][h_row(value)] += weight' : 'estimate = min(estimate, C[row][h_row(value)])')
    }
    if (action === 'insert') { this.total += weight; this.count += 1 }
    return { description: `${value} has estimated frequency ${minimum}. With positive updates this never underestimates; collisions can overestimate.`, value: minimum!.toString() }
  }
}
