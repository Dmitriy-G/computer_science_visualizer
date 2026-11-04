import { AppliedModel } from '../../../visualization/AppliedModel.ts'
import { LinearModel } from '../../../visualization/LinearModel.ts'
import type { LinearObserver, LinearResult } from '../../../visualization/LinearModel.ts'

export interface ByteLogRecord {
  readonly offset: number
  readonly value: number
  readonly timestamp: number | null
  readonly maximumTimestamp: number | null
  readonly position: number
  readonly bytes: number
}

// Common sequential encoded log storage; concrete subclasses own their indexes.
export abstract class ByteLog extends AppliedModel {
  protected records: ByteLogRecord[] = []
  protected nextOffset = 0
  protected nextPosition = 0
  public readonly countLabel = 'log records'
  public get length(): number { return this.records.length }
  protected abstract recordAdded(record: ByteLogRecord, slot: number): void
  protected abstract recordRemoved(record: ByteLogRecord): void

  protected copyStorage(copy: ByteLog): void {
    copy.records = this.records.map((record) => ({ ...record }))
    copy.nextOffset = this.nextOffset
    copy.nextPosition = this.nextPosition
  }

  protected append(value: number, timestamp: number | null, observer?: LinearObserver): LinearResult {
    if (this.length === 64) return this.reject('At most 64 retained log records are supported.')
    if (this.nextOffset === Number.MAX_SAFE_INTEGER) return this.reject('Safe logical offsets are exhausted.')
    const bytes = new TextEncoder().encode(`${this.nextOffset}:${timestamp ?? ''}:${value}\n`).length
    const previousMaximum = this.records[this.length - 1]?.maximumTimestamp ?? null
    const record: ByteLogRecord = {
      offset: this.nextOffset++, value, timestamp, position: this.nextPosition, bytes,
      maximumTimestamp: timestamp === null ? null : Math.max(previousMaximum ?? timestamp, timestamp),
    }
    this.nextPosition += bytes
    this.records.push(record)
    this.recordAdded(record, this.length - 1)
    LinearModel.emit(observer, `byte-log-${record.offset}`, `Append offset ${record.offset} at byte ${record.position}, encoded length ${record.bytes}.`, 'encode record; append bytes; update sparse checkpoint')
    return { description: `Appended value ${value} at offset ${record.offset}, byte ${record.position}.` }
  }

  protected clearLog(observer?: LinearObserver): LinearResult {
    while (this.records.length) {
      const record = this.records.pop()!
      this.recordRemoved(record)
      LinearModel.emit(observer, null, `Release retained offset ${record.offset} and its checkpoint if present.`, 'pop retained record; remove its sparse checkpoint')
    }
    this.nextPosition = 0
    return { description: `Released records and checkpoints; next logical offset remains ${this.nextOffset}. Byte positions restart in the empty simulated segment.` }
  }
}
