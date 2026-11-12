import { ArraySortOperations } from './ArraySortOperations.ts'
import type { ArrayEntry } from '../../../FundamentalDataStructures/Linear/Array/FixedArray.ts'
import type { ArraySortEvent, ArraySortStorage } from './ArraySortTrace.ts'

class StrandNode {
  public readonly entry: ArrayEntry
  public next: StrandNode | null = null
  constructor(entry: ArrayEntry) { this.entry = entry }
}

export class StrandArraySort extends ArraySortOperations {
  private remaining: StrandNode | null = null
  private strand: StrandNode | null = null
  private sorted: StrandNode | null = null
  private merged: StrandNode | null = null

  public sort(): void {
    if (this.entries.length < 2) return
    let tail: StrandNode | null = null
    for (const entry of this.entries) {
      const node = new StrandNode(entry)
      if (tail) tail.next = node
      else this.remaining = node
      tail = node
    }
    while (this.remaining) {
      this.strand = null
      let strandTail: StrandNode | null = null
      let previous: StrandNode | null = null
      let node: StrandNode | null = this.remaining
      while (node) {
        const next: StrandNode | null = node.next
        this.step('compare', 'Extend the next nondecreasing strand', `Inspect key ${node.entry.value}${strandTail ? ` after strand tail ${strandTail.entry.value}` : ' as the first strand entry'}. Accepted entries are unlinked from the remaining list in constant time.`, 'if strand empty or key >= tail: unlink and append', node.entry.id)
        if (!strandTail || node.entry.value >= strandTail.entry.value) {
          if (previous) previous.next = next
          else this.remaining = next
          node.next = null
          if (strandTail) strandTail.next = node
          else this.strand = node
          strandTail = node
          this.step('select', 'Append an entry to the strand', `Key ${node.entry.value} extends the strand. Its original entry ID follows the node.`, 'strand.append(unlinked node)', node.entry.id)
        } else previous = node
        node = next
      }
      this.step('run', 'A complete strand is ready', 'The remaining list retains skipped entries in their original order. Merge this nondecreasing strand into the accumulated sorted list.', 'merge(sorted, strand)')
      this.mergeStrand()
    }
    let destination = 0
    for (let node = this.sorted; node; node = node.next) this.entries[destination++] = node.entry
    this.emit('gather', 'Copy the accumulated sorted strand back', 'Repeated stable merging has consumed the remaining list. Copy original entries into the same fixed allocation.', 'array = sorted list', { sortedPrefix: this.entries.length })
  }

  private mergeStrand(): void {
    let tail: StrandNode | null = null
    this.merged = null
    while (this.sorted || this.strand) {
      const takeSorted = !this.strand || Boolean(this.sorted && this.sorted.entry.value <= this.strand.entry.value)
      const selected: StrandNode = takeSorted ? this.sorted! : this.strand!
      this.step('compare', 'Select the next stable merge head', 'Choose the smaller available head. The older accumulated list wins ties, preserving arrival order across strands.', 'take sorted head if sorted <= strand', selected.entry.id)
      if (takeSorted) this.sorted = selected.next
      else this.strand = selected.next
      selected.next = null
      if (tail) tail.next = selected
      else this.merged = selected
      tail = selected
      this.step('write', 'Move the selected node into the merged list', `Append key ${selected.entry.value} without copying or losing its original record.`, 'merged.append(selected head)', selected.entry.id)
    }
    this.sorted = this.merged
    this.merged = null
    this.step('merge', 'Commit this strand merge', 'The accumulated list is sorted. If entries remain, extract another strand and repeat.', 'sorted = merged; strand = empty')
  }

  private step(kind: ArraySortEvent['kind'], label: string, detail: string, code: string, active?: string): void {
    if (!this.observer) return
    const storage: ArraySortStorage[] = []
    for (const [id, head] of [['remaining', this.remaining], ['strand', this.strand], ['sorted', this.sorted], ['merged', this.merged]] as const) {
      const entries: ArrayEntry[] = []
      const activeIndices: number[] = []
      for (let node = head; node; node = node.next) {
        if (node.entry.id === active) activeIndices.push(entries.length)
        entries.push(node.entry)
      }
      storage.push({ id, label: id.toUpperCase(), status: 'LIST', runs: [{ id, label: id, entries, activeIndices, status: 'RECORD' }] })
    }
    this.emit(kind, label, detail, code, { storage })
  }
}
