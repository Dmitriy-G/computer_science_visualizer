import { AppliedModel } from '../../../../visualization/AppliedModel.ts'
import type { AppliedDiagram } from '../../../../visualization/AppliedModel.ts'
import { LinearModel } from '../../../../visualization/LinearModel.ts'
import type { LinearInputValues, LinearObserver, LinearResult } from '../../../../visualization/LinearModel.ts'
import type { ActionKind } from '../../../../visualization/ActionCatalog.ts'

export class AppendOnlyLog extends AppliedModel {
  public readonly kind = 'append-only-log'
  public readonly representation = 'Retained offset/value records, grouped into four-record segments. Reading does not consume records. This is an in-memory log, without Kafka replication, disk files, or consumer groups. Clear preserves the next offset.'
  private segments = new Map<number, { offset: number, value: number }[]>()
  private count = 0
  private nextOffset = 0
  public get length(): number { return this.count }
  public static createDefault(): AppendOnlyLog {
    const model = new AppendOnlyLog()
    for (let index = 0; index < 10; index += 1) model.execute('insert-end', { value: 10 * (index + 1) })
    return model
  }
  public clone(): AppendOnlyLog {
    const copy = new AppendOnlyLog()
    for (const [segment, records] of this.segments) copy.segments.set(segment, records.map((entry) => ({ ...entry })))
    copy.count = this.count
    copy.nextOffset = this.nextOffset
    return copy
  }
  public getDiagram(): AppliedDiagram {
    const rows = [[{ id: 'log-next', text: String(this.nextOffset), label: 'next offset' }]]
    for (const [segment, records] of this.segments) rows.push(records.map((entry) => ({ id: `log-${entry.offset}`, text: String(entry.value), label: `offset ${entry.offset} / segment ${segment}` })))
    return { rows }
  }
  public execute(action: ActionKind, input: LinearInputValues, observer?: LinearObserver): LinearResult {
    if (action === 'inspect-storage') return this.inspect(observer)
    if (action === 'clear') {
      for (const [segment, records] of this.segments) {
        while (records.length) {
          const first = records[0]
          LinearModel.emit(observer, `log-${first.offset}`, `Release retained offset ${first.offset}.`, 'release oldest retained record')
          records.shift()
          this.count -= 1
        }
        this.segments.delete(segment)
      }
      return { description: `Log is empty; the next append will use offset ${this.nextOffset}.` }
    }
    if (action === 'insert-end') {
      const value = LinearModel.integer(input, 'value')
      if (this.length === 64 || this.nextOffset === Number.MAX_SAFE_INTEGER) return this.reject('Log capacity or offset limit reached.')
      const offset = this.nextOffset++
      const segment = Math.floor(offset / 4)
      const records = this.segments.get(segment) ?? []
      records.push({ offset, value })
      this.segments.set(segment, records)
      this.count += 1
      LinearModel.emit(observer, `log-${offset}`, `Append ${value} at offset ${offset}; previous records remain intact.`, 'append(nextOffset++, value)', 'NEW')
      return { description: `Appended ${value} at offset ${offset}.`, activeId: `log-${offset}` }
    }
    if (action !== 'search-index') throw new RangeError('Unsupported log action')
    const offset = AppliedModel.bounded(input, 'index', 0, Number.MAX_SAFE_INTEGER)
    const entry = this.segments.get(Math.floor(offset / 4))?.find((record) => record.offset === offset)
    if (entry) LinearModel.emit(observer, `log-${entry.offset}`, `Read offset ${offset} without removing it.`, 'segment = segments[offset / 4]; locate offset within at most four records')
    return { description: entry ? `Offset ${offset} contains ${entry.value}.` : `Offset ${offset} is not retained.`, value: entry?.value ?? null, activeId: entry ? `log-${offset}` : null, status: entry ? 'FOUND' : 'ABSENT' }
  }
}
