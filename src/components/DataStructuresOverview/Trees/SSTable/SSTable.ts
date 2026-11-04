import { AppliedModel } from '../../../../visualization/AppliedModel.ts'
import type { AppliedDiagram } from '../../../../visualization/AppliedModel.ts'
import { LinearModel } from '../../../../visualization/LinearModel.ts'
import type { LinearInputValues, LinearObserver, LinearResult } from '../../../../visualization/LinearModel.ts'
import type { ActionKind } from '../../../../visualization/ActionCatalog.ts'
import { SortedRecords } from '../SortedRecords.ts'
import type { StoredRecord } from '../SortedRecords.ts'

interface TableBlock { readonly records: readonly StoredRecord[], readonly lastKey: number, readonly position: number, readonly bytes: number }

export class SSTable extends AppliedModel {
  public readonly kind = 'sstable'
  public readonly representation = 'An immutable sorted key/value table with three-record data blocks and an in-memory last-key block index. UTF-8 key:value newline encoding determines byte offsets and sizes. Lookup binary-searches the index, simulates one block read, then binary-searches its records. No disk I/O, cache, Bloom filter, compression, tombstones, or compaction.'
  private blocks: TableBlock[] = []
  public get length(): number {
    let count = 0
    for (const block of this.blocks) count += block.records.length
    return count
  }
  public static createDefault(): SSTable {
    const model = new SSTable()
    model.execute('build-values', { values: SortedRecords.defaults() })
    return model
  }
  public clone(): SSTable {
    const copy = new SSTable()
    copy.blocks = this.blocks.map((block) => ({ ...block, records: block.records.map((record) => ({ ...record })) }))
    return copy
  }
  public getDiagram(): AppliedDiagram {
    return { rows: [
      this.blocks.map((block, index) => ({ id: `sst-index-${index}`, text: `<= ${block.lastKey}`, label: `index / byte ${block.position}`, children: [`sst-block-${index}`] })),
      this.blocks.map((block, index) => ({ id: `sst-block-${index}`, text: `${block.bytes} bytes`, label: `data block ${index}`, children: block.records.map((record) => `sst-key-${record.key}`) })),
      this.blocks.flatMap((block) => block.records.map((record) => ({ id: `sst-key-${record.key}`, text: `${record.key}:${record.value}`, label: `byte ${record.position}` }))),
    ] }
  }
  public execute(action: ActionKind, input: LinearInputValues, observer?: LinearObserver): LinearResult {
    if (action === 'inspect-storage') return this.inspect(observer)
    if (action === 'build-values') {
      const records = SortedRecords.parse(input.values)
      const blocks: TableBlock[] = []
      for (let start = 0; start < records.length; start += 3) {
        const entries = records.slice(start, start + 3)
        let bytes = 0
        for (const record of entries) bytes += record.bytes
        blocks.push({ records: entries, lastKey: entries[entries.length - 1].key, position: entries[0].position, bytes })
      }
      this.blocks = blocks
      for (let index = 0; index < blocks.length; index += 1) LinearModel.emit(observer, `sst-index-${index}`, `Publish immutable block ${index} and its last-key index entry.`, 'sort unique records; encode blocks; index last keys and byte positions')
      return { description: `Built ${records.length} sorted records in ${blocks.length} immutable data blocks.` }
    }
    if (action === 'search-value') {
      const key = LinearModel.integer(input, 'key')
      let low = 0
      let high = this.blocks.length
      while (low < high) {
        const middle = Math.floor((low + high) / 2)
        LinearModel.emit(observer, `sst-index-${middle}`, `Compare ${key} with block fence ${this.blocks[middle].lastKey}.`, 'lower_bound(index.lastKey, key)')
        if (this.blocks[middle].lastKey < key) low = middle + 1
        else high = middle
      }
      const block = this.blocks[low]
      if (!block) return { description: `${key} is absent; no simulated data-block read.`, value: null, status: 'ABSENT' }
      LinearModel.emit(observer, `sst-block-${low}`, `Simulated read: ${block.bytes} bytes at byte ${block.position}.`, 'read data block at indexed byte position')
      low = 0
      high = block.records.length
      while (low < high) {
        const middle = Math.floor((low + high) / 2)
        const record = block.records[middle]
        LinearModel.emit(observer, `sst-key-${record.key}`, `Compare ${key} with stored key ${record.key}.`, 'lower_bound(block.records, key)')
        if (record.key < key) low = middle + 1
        else high = middle
      }
      const record = block.records[low]
      const found = record?.key === key
      return { description: found ? `Key ${key} has value ${record.value}; one simulated data-block read.` : `${key} is absent; one simulated data-block read.`, value: found ? record.value : null, activeId: found ? `sst-key-${key}` : null, status: found ? 'FOUND' : 'ABSENT' }
    }
    if (action === 'clear') {
      while (this.blocks.length) {
        this.blocks.pop()
        LinearModel.emit(observer, null, 'Release the last immutable block and its index entry.', 'remove last block and fence')
      }
      return { description: 'Released all data blocks and the block index.' }
    }
    throw new RangeError('Unsupported SSTable action')
  }
}
