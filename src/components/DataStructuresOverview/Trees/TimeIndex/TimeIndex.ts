import type { AppliedDiagram } from '../../../../visualization/AppliedModel.ts'
import { LinearModel } from '../../../../visualization/LinearModel.ts'
import type { LinearInputValues, LinearObserver, LinearResult } from '../../../../visualization/LinearModel.ts'
import type { ActionKind } from '../../../../visualization/ActionCatalog.ts'
import { ByteLog } from '../ByteLog.ts'
import type { ByteLogRecord } from '../ByteLog.ts'

interface TimeSample { readonly timestamp: number, readonly offset: number, readonly slot: number, readonly nextPosition: number }

export class TimeIndex extends ByteLog {
  public readonly kind = 'time-index'
  public readonly representation = 'A timestamped log with nondecreasing prefix-maximum checkpoints at each three-record boundary. Timestamps may arrive out of order. Lookup skips only checkpoints strictly below the requested time, then scans for the first qualifying physical offset. This Kafka-inspired conservative boundary variant stores block-end offsets, not Kafka timestamp batch metadata; byte reads are simulated.'
  private samples: TimeSample[] = []
  public static createDefault(): TimeIndex {
    const model = new TimeIndex()
    for (let index = 0; index < 10; index += 1) model.execute('insert-end', { timestamp: [10, 20, 15, 40, 35, 40, 70, 60, 90, 100][index], value: index + 1 })
    return model
  }
  public clone(): TimeIndex {
    const copy = new TimeIndex()
    this.copyStorage(copy)
    copy.samples = this.samples.map((sample) => ({ ...sample }))
    return copy
  }
  protected recordAdded(record: ByteLogRecord, slot: number): void {
    if (slot % 3 === 2) this.samples.push({ timestamp: record.maximumTimestamp!, offset: record.offset, slot, nextPosition: record.position + record.bytes })
  }
  protected recordRemoved(record: ByteLogRecord): void {
    if (this.samples[this.samples.length - 1]?.offset === record.offset) this.samples.pop()
  }
  public getDiagram(): AppliedDiagram {
    return { rows: [
      this.samples.map((sample) => ({ id: `time-sample-${sample.offset}`, text: `max ${sample.timestamp}`, label: `through offset ${sample.offset}`, children: [`byte-log-${sample.offset}`] })),
      this.records.map((record) => ({ id: `byte-log-${record.offset}`, text: `${record.timestamp}:${record.value}`, label: `offset ${record.offset} / byte ${record.position}` })),
    ] }
  }
  public execute(action: ActionKind, input: LinearInputValues, observer?: LinearObserver): LinearResult {
    if (action === 'inspect-storage') return this.inspect(observer)
    if (action === 'clear') return this.clearLog(observer)
    if (action === 'insert-end') {
      const timestamp = LinearModel.integer(input, 'timestamp')
      if (timestamp < 0) throw new RangeError('Timestamps must be nonnegative')
      return this.append(LinearModel.integer(input, 'value'), timestamp, observer)
    }
    if (action !== 'search-value') throw new RangeError('Unsupported time-index action')
    const target = LinearModel.integer(input, 'timestamp')
    if (target < 0) throw new RangeError('Timestamps must be nonnegative')
    let low = 0
    let high = this.samples.length
    while (low < high) {
      const middle = Math.floor((low + high) / 2)
      const sample = this.samples[middle]
      LinearModel.emit(observer, `time-sample-${sample.offset}`, `Compare requested time ${target} with prefix maximum ${sample.timestamp}.`, 'lower_bound(checkpoint.maxTimestamp, target)')
      if (sample.timestamp < target) low = middle + 1
      else high = middle
    }
    const previous = low ? this.samples[low - 1] : null
    const start = previous ? previous.slot + 1 : 0
    LinearModel.emit(observer, previous ? `time-sample-${previous.offset}` : null, `Simulated seek to byte ${previous?.nextPosition ?? 0}; earlier prefix maxima are strictly below ${target}.`, 'seek after last checkpoint with maxTimestamp < target')
    for (let slot = start; slot < this.length; slot += 1) {
      const record = this.records[slot]
      LinearModel.emit(observer, `byte-log-${record.offset}`, `Read timestamp ${record.timestamp} at offset ${record.offset}.`, 'scan forward; return first timestamp >= target')
      if (record.timestamp! >= target) return { description: `First qualifying offset: ${record.offset}, timestamp ${record.timestamp}, value ${record.value}, byte ${record.position}.`, value: record.offset, activeId: `byte-log-${record.offset}`, status: 'FOUND' }
    }
    return { description: `No retained record has timestamp at least ${target}.`, value: null, status: 'ABSENT' }
  }
}
