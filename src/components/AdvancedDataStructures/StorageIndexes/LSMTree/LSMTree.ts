import { AdditionalTreeModel } from '../../../../visualization/AdditionalTreeModel.ts'
import type { TreeDiagramEntry, TreeInputValues, TreeOperationResult } from '../../../../visualization/AdditionalTreeModel.ts'
import type { ActionKind } from '../../../../visualization/ActionCatalog.ts'
import { TreeTrace } from '../../../../visualization/TreeTrace.ts'
import type { TreeTraceObserver } from '../../../../visualization/TreeTrace.ts'

export interface LSMRecord {
  readonly key: number
  readonly value: number | null
  readonly version: number
}
export interface LSMLookupResult extends LSMRecord {
  readonly location: string
}
export interface SortedRun {
  readonly id: string
  readonly level: number
  readonly records: readonly LSMRecord[]
  readonly pending?: boolean
}

export class LSMTree extends AdditionalTreeModel {
  public readonly kind = 'lsm-tree'
  private memtable: LSMRecord[] = []
  private runs: SortedRun[] = []
  private pendingRun: SortedRun | null = null
  private nextVersion = 1
  private nextRunId = 1
  private count = 0
  public get length(): number { return this.count }
  public get storedCount(): number {
    let count = this.memtable.length
    for (const run of this.runs) count += run.records.length
    return count
  }
  public get runCount(): number { return this.runs.length }

  public static createDefault(): LSMTree {
    const result = new LSMTree()
    for (let key = 10; key <= 100; key += 10) result.put(key, key * 10)
    return result
  }

  public clone(): LSMTree {
    const result = new LSMTree()
    for (const record of this.memtable) result.memtable.push({ ...record })
    for (const run of this.runs) {
      const records: LSMRecord[] = []
      for (const record of run.records) records.push({ ...record })
      result.runs.push({ ...run, records })
    }
    result.nextVersion = this.nextVersion
    result.nextRunId = this.nextRunId
    result.count = this.count
    return result
  }

  public getRows(): readonly SortedRun[] {
    const rows: SortedRun[] = [{ id: 'lsm-memtable', level: -1, records: [...this.memtable] }]
    for (let index = this.runs.length - 1; index >= 0; index -= 1) rows.push(this.runs[index])
    if (this.pendingRun) rows.push(this.pendingRun)
    return rows
  }

  private searchRecords(records: readonly LSMRecord[], key: number, location: string, observer?: TreeTraceObserver): LSMLookupResult | undefined {
    let left = 0
    let right = records.length - 1
    while (left <= right) {
      const middle = Math.floor((left + right) / 2)
      const record = records[middle]
      TreeTrace.emit(observer, 'compare', `lsm-v-${record.version}`, 'Binary search a sorted run', `Compare key ${key} with ${record.key}.`, 'mid = floor((left + right) / 2); compare key')
      if (record.key === key) return { ...record, location: `${location}, index ${middle}` }
      if (key < record.key) right = middle - 1
      else left = middle + 1
    }
    return undefined
  }

  public lookup(key: number, observer?: TreeTraceObserver): LSMLookupResult | undefined {
    TreeTrace.validate(key)
    const memory = this.searchRecords(this.memtable, key, 'memtable', observer)
    if (memory) return memory
    for (let index = this.runs.length - 1; index >= 0; index -= 1) {
      TreeTrace.emit(observer, 'visit', this.runs[index].id, 'Inspect the next older run', 'Search runs from newest to oldest; stop at the first value or tombstone.', 'for run in newest_to_oldest')
      const record = this.searchRecords(this.runs[index].records, key, `${this.runs[index].id} (level ${this.runs[index].level})`, observer)
      if (record) return record
    }
    return undefined
  }

  private write(key: number, value: number | null, observer?: TreeTraceObserver): void {
    TreeTrace.validate(key)
    if (value !== null) TreeTrace.validate(value)
    const previous = this.lookup(key)
    const existed = previous !== undefined && previous.value !== null
    if (!existed && value !== null) this.count += 1
    if (existed && value === null) this.count -= 1
    const record = { key, value, version: this.nextVersion++ }
    let index = 0
    while (index < this.memtable.length && this.memtable[index].key < key) {
      TreeTrace.emit(observer, 'compare', `lsm-v-${this.memtable[index].version}`, 'Find the memtable position', `Keep sorted-array memtable keys below ${key} before this write.`, 'advance while memtable[i].key < key')
      index += 1
    }
    if (this.memtable[index]?.key === key) this.memtable[index] = record
    else this.memtable.splice(index, 0, record)
    TreeTrace.emit(observer, 'create', `lsm-v-${record.version}`, value === null ? 'Write a tombstone' : 'Write the newest version', value === null ? `A tombstone for ${key} hides older values until full compaction.` : `Write ${key} -> ${value} in the sorted memtable.`, value === null ? 'memtable[key] = TOMBSTONE' : 'memtable[key] = value', `lsm-v-${record.version}`)
    if (this.memtable.length >= 4) this.flush(observer)
  }

  public put(key: number, value: number, observer?: TreeTraceObserver): void { this.write(key, value, observer) }
  public delete(key: number, observer?: TreeTraceObserver): void { this.write(key, null, observer) }

  public flush(observer?: TreeTraceObserver): void {
    if (!this.memtable.length) return
    const records: LSMRecord[] = []
    for (const record of this.memtable) {
      records.push(record)
      TreeTrace.emit(observer, 'visit', `lsm-v-${record.version}`, 'Copy a sorted memtable record', `Copy key ${record.key} to the immutable sorted run.`, 'run.append(record)')
    }
    const run = { id: `lsm-run-${this.nextRunId++}`, level: 0, records }
    this.runs.push(run)
    this.memtable = []
    TreeTrace.emit(observer, 'connect', run.id, 'Publish the new sorted run', 'The newest level-0 run is immutable; the memtable is empty.', 'runs.append(run); memtable = []')
  }

  public compact(observer?: TreeTraceObserver): void {
    this.flush(observer)
    if (!this.runs.length) return
    let merged: readonly LSMRecord[] = []
    const outputId = `lsm-run-${this.nextRunId++}`
    for (const run of this.runs) {
      const output: LSMRecord[] = []
      this.pendingRun = { id: outputId, level: 1, records: output, pending: true }
      let left = 0
      let right = 0
      while (left < merged.length || right < run.records.length) {
        let selected: LSMRecord
        if (right >= run.records.length || left < merged.length && merged[left].key < run.records[right].key) selected = merged[left++]
        else if (left >= merged.length || run.records[right].key < merged[left].key) selected = run.records[right++]
        else {
          selected = merged[left].version > run.records[right].version ? merged[left] : run.records[right]
          left += 1
          right += 1
        }
        output.push(selected)
        TreeTrace.emit(observer, 'merge', outputId, 'Merge sorted records', `Keep the newest version of key ${selected.key}, including its tombstone until all runs are merged.`, 'merge by key; keep greatest sequence number')
      }
      merged = output
    }
    const records: LSMRecord[] = []
    for (const record of merged) {
      if (record.value !== null) records.push(record)
      else TreeTrace.emit(observer, 'remove', outputId, 'Drop a fully covered tombstone', `Discard key ${record.key}; every older run is included, so no deleted value can reappear.`, 'if tombstone and all older runs covered: discard')
    }
    this.runs = records.length ? [{ id: outputId, level: 1, records }] : []
    this.pendingRun = null
    TreeTrace.emit(observer, 'connect', records.length ? outputId : null, 'Publish full compaction', 'Replace all old runs with one sorted run containing only the latest live records.', 'replace all runs with compacted output')
  }

  public clear(observer?: TreeTraceObserver): void {
    while (this.memtable.length) {
      this.memtable.pop()
      TreeTrace.emit(observer, 'remove', 'lsm-memtable', 'Release a memory record', 'Release the last memtable record.', 'memtable.pop()')
    }
    while (this.runs.length) {
      const run = this.runs.pop()!
      TreeTrace.emit(observer, 'remove', null, 'Release an immutable run', `Release ${run.id} and its ${run.records.length} records.`, 'release sorted run')
    }
    this.count = 0
  }

  public getDiagram(): readonly TreeDiagramEntry[] {
    const entries: TreeDiagramEntry[] = []
    for (const row of this.getRows()) entries.push({ id: row.id, text: row.level === -1 ? 'memtable' : row.id, label: row.level === -1 ? 'sorted / capacity 4' : `level ${row.level}`, children: [] })
    return entries
  }

  public execute(action: ActionKind, input: TreeInputValues, observer?: TreeTraceObserver): TreeOperationResult {
    if (action === 'clear') {
      this.clear(observer)
      return { description: 'All memtable records and sorted runs released.' }
    }
    if (action === 'flush') {
      const count = this.memtable.length
      this.flush(observer)
      return { description: count ? `Flushed ${count} records to a new level-0 run; live keys unchanged.` : 'The memtable is empty; nothing to flush.' }
    }
    if (action === 'compact') {
      this.compact(observer)
      return { description: `Full compaction complete: ${this.length} live keys, ${this.runs.length} sorted run(s); obsolete versions and covered tombstones removed.` }
    }
    const key = AdditionalTreeModel.integer(input, 'key')
    if (action === 'insert') {
      const value = AdditionalTreeModel.integer(input, 'value')
      this.put(key, value, observer)
      return { description: `Stored newest value ${key} -> ${value}; ${this.length} live keys.` }
    }
    if (action === 'delete-value') {
      this.delete(key, observer)
      return { description: `Wrote a tombstone for key ${key}; older values are hidden. ${this.length} live keys.` }
    }
    const record = this.lookup(key, observer)
    const found = record !== undefined && record.value !== null
    return { description: found ? `Key ${key} found: value ${record.value} at ${record.location}, sequence ${record.version}.` : record ? `Key ${key} is deleted: tombstone at ${record.location}, sequence ${record.version}, hides older values.` : `Key ${key} not found in the memtable or any sorted run.`, returnValue: record?.value ?? null, activeId: record ? `lsm-v-${record.version}` : null, status: found ? 'FOUND' : 'NOT FOUND' }
  }
}
