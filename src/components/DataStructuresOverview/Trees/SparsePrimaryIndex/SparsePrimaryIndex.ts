import { AppliedModel } from '../../../../visualization/AppliedModel.ts'
import type { AppliedDiagram } from '../../../../visualization/AppliedModel.ts'
import { LinearModel } from '../../../../visualization/LinearModel.ts'
import type { LinearInputValues, LinearObserver, LinearResult } from '../../../../visualization/LinearModel.ts'
import type { ActionKind } from '../../../../visualization/ActionCatalog.ts'
import { SortedRecords } from '../SortedRecords.ts'
import type { StoredRecord } from '../SortedRecords.ts'

interface Sample { readonly key: number, readonly slot: number, readonly position: number }

export class SparsePrimaryIndex extends AppliedModel {
  public readonly kind = 'sparse-primary-index'
  public readonly representation = 'A sorted unique key/value file with every third key sampled into a sparse primary index. Samples store actual UTF-8 byte positions in key:value newline records. Lookup chooses the greatest sampled key <= target and scans at most three records. This direct-data teaching variant differs from Cassandra summaries that sample a separate primary-index file.'
  private records: StoredRecord[] = []
  private samples: Sample[] = []
  public get length(): number { return this.records.length }
  public static createDefault(): SparsePrimaryIndex {
    const model = new SparsePrimaryIndex()
    model.execute('build-values', { values: SortedRecords.defaults() })
    return model
  }
  public clone(): SparsePrimaryIndex {
    const copy = new SparsePrimaryIndex()
    copy.records = this.records.map((record) => ({ ...record }))
    copy.samples = this.samples.map((sample) => ({ ...sample }))
    return copy
  }
  public getDiagram(): AppliedDiagram {
    return { rows: [
      this.samples.map((sample) => ({ id: `primary-sample-${sample.key}`, text: String(sample.key), label: `sample / byte ${sample.position}`, children: [`primary-key-${sample.key}`] })),
      this.records.map((record) => ({ id: `primary-key-${record.key}`, text: `${record.key}:${record.value}`, label: `byte ${record.position}` })),
    ] }
  }
  public execute(action: ActionKind, input: LinearInputValues, observer?: LinearObserver): LinearResult {
    if (action === 'inspect-storage') return this.inspect(observer)
    if (action === 'build-values') {
      const records = SortedRecords.parse(input.values)
      const samples: Sample[] = []
      for (let slot = 0; slot < records.length; slot += 3) samples.push({ key: records[slot].key, slot, position: records[slot].position })
      this.records = records
      this.samples = samples
      for (const sample of samples) LinearModel.emit(observer, `primary-sample-${sample.key}`, `Sample key ${sample.key} at byte ${sample.position}.`, 'sample each third sorted record with its encoded byte position')
      return { description: `Built ${records.length} records and ${samples.length} sparse samples.` }
    }
    if (action === 'search-value') {
      const key = LinearModel.integer(input, 'key')
      let low = 0
      let high = this.samples.length
      while (low < high) {
        const middle = Math.floor((low + high) / 2)
        const sample = this.samples[middle]
        LinearModel.emit(observer, `primary-sample-${sample.key}`, `Find the last sample no greater than ${key}.`, 'upper_bound(sample.key, key) - 1')
        if (sample.key <= key) low = middle + 1
        else high = middle
      }
      if (low === 0) return { description: `${key} precedes the first stored key or the file is empty.`, value: null, status: 'ABSENT' }
      const sample = this.samples[low - 1]
      LinearModel.emit(observer, `primary-sample-${sample.key}`, `Simulated seek to byte ${sample.position}.`, 'seek(sample.position); scan only selected interval')
      let scanned = 0
      for (let slot = sample.slot; slot < Math.min(this.length, sample.slot + 3); slot += 1) {
        const record = this.records[slot]
        scanned++
        LinearModel.emit(observer, `primary-key-${record.key}`, `Scan key ${record.key} at byte ${record.position}.`, 'read next record; stop on match, larger key, or interval end')
        if (record.key === key) return { description: `Key ${key} has value ${record.value}; scanned ${scanned} records.`, value: record.value, activeId: `primary-key-${key}`, status: 'FOUND' }
        if (record.key > key) break
      }
      return { description: `${key} is absent; scanned ${scanned} records in the selected interval.`, value: null, status: 'ABSENT' }
    }
    if (action === 'clear') {
      while (this.records.length) {
        this.records.pop()
        if (this.samples[this.samples.length - 1]?.slot === this.records.length) this.samples.pop()
        LinearModel.emit(observer, null, 'Release the last record and any sample pointing to it.', 'pop record; drop dangling sparse sample')
      }
      return { description: 'Released the sorted records and sparse samples.' }
    }
    throw new RangeError('Unsupported sparse-primary action')
  }
}
