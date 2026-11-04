import type { AppliedDiagram } from '../../../../visualization/AppliedModel.ts'
import { LinearModel } from '../../../../visualization/LinearModel.ts'
import type { LinearInputValues, LinearObserver, LinearResult } from '../../../../visualization/LinearModel.ts'
import type { ActionKind } from '../../../../visualization/ActionCatalog.ts'
import { ByteLog } from '../ByteLog.ts'
import type { ByteLogRecord } from '../ByteLog.ts'

interface OffsetSample { readonly offset: number, readonly position: number, readonly slot: number }

export class SparseOffsetIndex extends ByteLog {
  public readonly kind = 'sparse-offset-index'
  public readonly representation = 'A log segment retains logical offset/value records and actual UTF-8 byte positions. Every third record stores an offset-to-byte checkpoint. Lookup floors the sparse offset index, seeks to that byte position, and scans at most three records. This Kafka-inspired sequential variant uses text encoding and simulated reads, without Kafka batches or files.'
  private samples: OffsetSample[] = []
  public static createDefault(): SparseOffsetIndex {
    const model = new SparseOffsetIndex()
    for (let value = 1; value <= 10; value += 1) model.execute('insert-end', { value: value * 11 })
    return model
  }
  public clone(): SparseOffsetIndex {
    const copy = new SparseOffsetIndex()
    this.copyStorage(copy)
    copy.samples = this.samples.map((sample) => ({ ...sample }))
    return copy
  }
  protected recordAdded(record: ByteLogRecord, slot: number): void {
    if (slot % 3 === 0) this.samples.push({ offset: record.offset, position: record.position, slot })
  }
  protected recordRemoved(record: ByteLogRecord): void {
    if (this.samples[this.samples.length - 1]?.offset === record.offset) this.samples.pop()
  }
  public getDiagram(): AppliedDiagram {
    return { rows: [
      this.samples.map((sample) => ({ id: `offset-sample-${sample.offset}`, text: String(sample.offset), label: `checkpoint / byte ${sample.position}`, children: [`byte-log-${sample.offset}`] })),
      this.records.map((record) => ({ id: `byte-log-${record.offset}`, text: String(record.value), label: `offset ${record.offset} / byte ${record.position}` })),
    ] }
  }
  public execute(action: ActionKind, input: LinearInputValues, observer?: LinearObserver): LinearResult {
    if (action === 'inspect-storage') return this.inspect(observer)
    if (action === 'clear') return this.clearLog(observer)
    if (action === 'insert-end') return this.append(LinearModel.integer(input, 'value'), null, observer)
    if (action !== 'search-index') throw new RangeError('Unsupported sparse-offset action')
    const target = LinearModel.integer(input, 'index')
    if (target < 0) throw new RangeError('Offsets must be nonnegative')
    let low = 0
    let high = this.samples.length
    while (low < high) {
      const middle = Math.floor((low + high) / 2)
      const sample = this.samples[middle]
      LinearModel.emit(observer, `offset-sample-${sample.offset}`, `Compare target offset ${target} with checkpoint ${sample.offset}.`, 'upper_bound(checkpoint.offset, target) - 1')
      if (sample.offset <= target) low = middle + 1
      else high = middle
    }
    if (!low) return { description: `Offset ${target} is absent from the retained segment.`, value: null, status: 'ABSENT' }
    const sample = this.samples[low - 1]
    LinearModel.emit(observer, `offset-sample-${sample.offset}`, `Simulated seek to byte ${sample.position}.`, 'seek(checkpoint.position)')
    for (let slot = sample.slot; slot < Math.min(this.length, sample.slot + 3); slot += 1) {
      const record = this.records[slot]
      LinearModel.emit(observer, `byte-log-${record.offset}`, `Read offset ${record.offset} at byte ${record.position}.`, 'scan encoded records within checkpoint interval')
      if (record.offset === target) return { description: `Offset ${target} has value ${record.value} at byte ${record.position}.`, value: record.value, activeId: `byte-log-${record.offset}`, status: 'FOUND' }
      if (record.offset > target) break
    }
    return { description: `Offset ${target} is absent; the bounded interval scan is complete.`, value: null, status: 'ABSENT' }
  }
}
