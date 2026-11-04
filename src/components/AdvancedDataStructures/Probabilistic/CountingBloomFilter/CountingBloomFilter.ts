import { ProbabilisticModel } from '../ProbabilisticModel.ts'
import { ProbabilisticHash } from '../../../../visualization/ProbabilisticHash.ts'
import type { ActionKind } from '../../../../visualization/ActionCatalog.ts'
import type { LinearInputValues, LinearObserver, LinearResult } from '../../../../visualization/LinearModel.ts'

export class CountingBloomFilter extends ProbabilisticModel {
  public readonly kind = 'counting-bloom-filter' as const
  public static readonly counterCount = 32
  public static readonly maximumCounter = 15
  private counters = new Array<number>(32).fill(0)
  // Teaching safety guard only: queries NEVER use these exact keys.
  private occurrences = new Map<number, number>()

  public static createDefault(): CountingBloomFilter {
    const model = new CountingBloomFilter()
    for (let value = 10; value <= 100; value += 10) model.execute('insert', { value })
    return model
  }

  public getCounters(): readonly number[] { return [...this.counters] }

  public positions(value: number): readonly number[] {
    return [0, 1, 2].map((seed) => ProbabilisticHash.index(value, seed, 32))
  }

  public clone(): CountingBloomFilter {
    const copy = new CountingBloomFilter()
    copy.count = this.count
    copy.counters = [...this.counters]
    copy.occurrences = new Map(this.occurrences)
    return copy
  }

  public execute(action: ActionKind, input: LinearInputValues, observer?: LinearObserver): LinearResult {
    if (action === 'clear') {
      for (let index = 0; index < 32; index += 1) {
        this.counters[index] = 0
        CountingBloomFilter.emit(observer, `counter-${index}`, `Reset counter ${index}.`, 'C[i] = 0')
      }
      this.count = 0
      this.occurrences.clear()
      return { description: 'All counters and the deletion guard are empty.' }
    }
    const value = CountingBloomFilter.integer(input, 'value')
    const positions = this.positions(value)
    if (action === 'search-value') {
      for (const index of positions) {
        CountingBloomFilter.emit(observer, `counter-${index}`, `Read counter ${index}: ${this.counters[index]}.`, 'if C[h_i(value)] == 0: return definitely absent')
        if (this.counters[index] === 0) return { description: `${value} is definitely absent.`, value: false, activeId: `counter-${index}` }
      }
      return { description: `${value} may be present; positive counters can belong to other values.`, value: true }
    }
    if (action !== 'insert' && action !== 'delete-value') throw new RangeError('Unsupported counting Bloom operation')
    const multiplicity = this.occurrences.get(value) ?? 0
    if (action === 'delete-value' && multiplicity === 0) return this.rejected('Deletion requires a recorded insertion. A positive filter answer alone is unsafe.')
    const increments = new Map<number, number>()
    for (const index of positions) increments.set(index, (increments.get(index) ?? 0) + 1)
    if (action === 'insert') {
      if (this.count >= 64) return this.rejected('The lesson supports 64 live insertions.')
      for (const [index, amount] of increments) {
        if (this.counters[index] + amount > 15) return this.rejected('A four-bit counter would overflow. All counters are preserved; clear or remove recorded values first.')
      }
    }
    const direction = action === 'insert' ? 1 : -1
    for (const [index, amount] of increments) {
      this.counters[index] += direction * amount
      CountingBloomFilter.emit(observer, `counter-${index}`, `Counter ${index} becomes ${this.counters[index]} (${amount} hash contribution${amount === 1 ? '' : 's'}).`, 'C[index] += direction * hashMultiplicity')
    }
    this.count += direction
    if (multiplicity + direction === 0) this.occurrences.delete(value)
    else this.occurrences.set(value, multiplicity + direction)
    return { description: `${action === 'insert' ? 'Added' : 'Removed one recorded occurrence of'} ${value}. Queries still use only counters.` }
  }
}
