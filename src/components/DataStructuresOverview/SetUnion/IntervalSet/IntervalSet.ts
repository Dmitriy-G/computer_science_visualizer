import { SetUnionModel } from '../SetUnionModel.ts'
import type { ActionKind } from '../../../../visualization/ActionCatalog.ts'
import type { LinearInputValues, LinearObserver, LinearResult } from '../../../../visualization/LinearModel.ts'

export interface SetInterval {
  readonly id: string
  readonly minimum: number
  readonly maximum: number
}

export class IntervalSet extends SetUnionModel {
  public readonly kind = 'interval-set'
  private intervals: SetInterval[] = []
  private nextId = 0
  public get length(): number { return this.intervals.length }

  public static createDefault(): IntervalSet {
    const model = new IntervalSet()
    for (let index = 0; index < 10; index += 1) model.execute('insert', { minimum: index * 10, maximum: index * 10 + 4 })
    return model
  }

  public getIntervals(): SetInterval[] {
    const copy: SetInterval[] = []
    for (const interval of this.intervals) copy.push({ ...interval })
    return copy
  }

  public clone(): IntervalSet {
    const copy = new IntervalSet()
    copy.intervals = this.getIntervals()
    copy.nextId = this.nextId
    return copy
  }

  public execute(action: ActionKind, input: LinearInputValues, observer?: LinearObserver): LinearResult {
    if (action === 'clear') {
      while (this.intervals.length) {
        const interval = this.intervals[this.intervals.length - 1]
        SetUnionModel.emit(observer, interval.id, `Release [${interval.minimum}, ${interval.maximum}].`, 'remove last interval')
        this.intervals.pop()
      }
      return { description: 'All stored intervals have been released.' }
    }
    if (action === 'search-value') {
      const value = SetUnionModel.integer(input, 'value')
      let low = 0
      let high = this.intervals.length
      while (low < high) {
        const middle = Math.floor((low + high) / 2)
        const interval = this.intervals[middle]
        SetUnionModel.emit(observer, interval.id, `Compare ${value} with [${interval.minimum}, ${interval.maximum}].`, 'binary search interval bounds')
        if (value < interval.minimum) high = middle
        else if (value > interval.maximum) low = middle + 1
        else return { description: `${value} belongs to [${interval.minimum}, ${interval.maximum}].`, activeId: interval.id, status: 'FOUND', value: true }
      }
      return { description: `${value} is outside all stored intervals.`, status: 'ABSENT', value: false }
    }
    if (action !== 'insert' && action !== 'delete-value' && action !== 'search-overlap') throw new RangeError('Unsupported interval-set action')
    let minimum = SetUnionModel.integer(input, 'minimum')
    let maximum = SetUnionModel.integer(input, 'maximum')
    if (maximum < minimum) throw new RangeError('Maximum must be at least minimum')
    if (action === 'search-overlap') {
      const matches: string[] = []
      let activeId: string | undefined
      for (const interval of this.intervals) {
        SetUnionModel.emit(observer, interval.id, `Compare [${minimum}, ${maximum}] with [${interval.minimum}, ${interval.maximum}].`, 'if ranges overlap: output intersection')
        if (interval.minimum > maximum) break
        if (interval.maximum >= minimum) {
          matches.push(`[${Math.max(minimum, interval.minimum)}, ${Math.min(maximum, interval.maximum)}]`)
          activeId = interval.id
        }
      }
      return { description: `Intersection: ${matches.length ? matches.join(', ') : 'empty'}. Stored intervals are unchanged.`, activeId, status: matches.length ? 'OVERLAP' : 'ABSENT', value: matches.join(', ') }
    }
    const result: SetInterval[] = []
    let nextId = this.nextId
    if (action === 'insert') {
      let mergedId: string | undefined
      let inserted = false
      for (const interval of this.intervals) {
        SetUnionModel.emit(observer, interval.id, `Compare the candidate [${minimum}, ${maximum}] with [${interval.minimum}, ${interval.maximum}].`, 'compare endpoints for ordering, overlap, or adjacency')
        // BigInt avoids overflow in adjacent-endpoint comparisons at safe-integer limits.
        if (BigInt(interval.maximum) + 1n < BigInt(minimum)) result.push(interval)
        else if (BigInt(maximum) + 1n < BigInt(interval.minimum)) {
          if (!inserted) {
            result.push({ id: mergedId ?? `interval-${nextId++}`, minimum, maximum })
            inserted = true
          }
          result.push(interval)
        } else {
          mergedId ??= interval.id
          minimum = Math.min(minimum, interval.minimum)
          maximum = Math.max(maximum, interval.maximum)
          SetUnionModel.emit(observer, interval.id, `Coalesce overlapping or adjacent bounds into [${minimum}, ${maximum}].`, 'lo = min(lo, interval.lo); hi = max(hi, interval.hi)', 'MERGE')
        }
      }
      if (!inserted) result.push({ id: mergedId ?? `interval-${nextId++}`, minimum, maximum })
    } else {
      for (const interval of this.intervals) {
        SetUnionModel.emit(observer, interval.id, `Check whether [${interval.minimum}, ${interval.maximum}] overlaps the removed range.`, 'compare interval with removal bounds')
        if (interval.maximum < minimum || interval.minimum > maximum) { result.push(interval); continue }
        SetUnionModel.emit(observer, interval.id, `Subtract [${minimum}, ${maximum}] from [${interval.minimum}, ${interval.maximum}].`, 'retain the left and right remainders, if nonempty', 'SPLIT')
        if (interval.minimum < minimum) result.push({ id: interval.id, minimum: interval.minimum, maximum: minimum - 1 })
        if (interval.maximum > maximum) result.push({ id: interval.minimum < minimum ? `interval-${nextId++}` : interval.id, minimum: maximum + 1, maximum: interval.maximum })
      }
    }
    if (result.length > SetUnionModel.maximumElements) return this.reject('The result would exceed 64 intervals. All intervals and IDs are preserved.')
    this.intervals = result
    this.nextId = nextId
    SetUnionModel.emit(observer, null, `Publish ${result.length} sorted, disjoint intervals after ${action === 'insert' ? 'coalescing' : 'splitting'}.`, 'intervals = completeResult')
    return { description: `${action === 'insert' ? 'Union added the inclusive range' : 'Difference removed the inclusive range'}; ${this.length} stored interval(s) remain.` }
  }
}
