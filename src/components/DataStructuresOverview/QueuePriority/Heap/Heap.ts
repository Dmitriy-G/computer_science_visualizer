import { AdditionalTreeModel } from '../../../../visualization/AdditionalTreeModel.ts'
import type { TreeDiagramEntry, TreeInputValues, TreeOperationResult } from '../../../../visualization/AdditionalTreeModel.ts'
import type { ActionKind } from '../../../../visualization/ActionCatalog.ts'
import { TreeTrace } from '../../../../visualization/TreeTrace.ts'
import type { TreeTraceObserver } from '../../../../visualization/TreeTrace.ts'

interface HeapEntry {
  readonly id: string
  readonly value: number
}

export class Heap extends AdditionalTreeModel {
  public readonly kind = 'heap'
  private entries: HeapEntry[] = []
  private nextId = 1
  public get length(): number { return this.entries.length }

  public static createDefault(): Heap {
    const result = new Heap()
    for (const value of [40, 20, 70, 10, 50, 90, 30, 60, 80, 100]) result.insert(value)
    return result
  }

  public clone(): Heap {
    const result = new Heap()
    for (const entry of this.entries) result.entries.push({ ...entry })
    result.nextId = this.nextId
    return result
  }

  public getValues(): readonly number[] {
    const values: number[] = []
    for (const entry of this.entries) values.push(entry.value)
    return values
  }

  private swap(first: number, second: number, observer?: TreeTraceObserver): void {
    const saved = this.entries[first]
    this.entries[first] = this.entries[second]
    this.entries[second] = saved
    TreeTrace.emit(observer, 'rotate', saved.id, 'Swap heap positions', `Swap indices ${first} and ${second} to restore parent <= child.`, 'swap(heap[first], heap[second])')
  }

  public insert(value: number, observer?: TreeTraceObserver): void {
    TreeTrace.validate(value)
    const entry = { id: `heap-${this.nextId++}`, value }
    this.entries.push(entry)
    TreeTrace.emit(observer, 'create', entry.id, 'Append a leaf', `Append ${value} at index ${this.length - 1}; keep the tree complete.`, 'heap.push(value)', entry.id)
    let index = this.length - 1
    while (index > 0) {
      const parent = Math.floor((index - 1) / 2)
      TreeTrace.emit(observer, 'compare', entry.id, 'Compare with the parent', `Compare ${this.entries[index].value} with parent ${this.entries[parent].value}.`, 'parent = floor((index - 1) / 2)')
      if (this.entries[parent].value <= this.entries[index].value) break
      this.swap(index, parent, observer)
      index = parent
    }
  }

  public peek(): number | undefined { return this.entries[0]?.value }

  public extractMin(observer?: TreeTraceObserver): number | undefined {
    const root = this.entries[0]
    if (!root) return undefined
    TreeTrace.emit(observer, 'visit', root.id, 'Read the minimum', `${root.value} is the minimum at the root.`, 'minimum = heap[0]')
    const last = this.entries.pop()!
    if (this.length) this.entries[0] = last
    TreeTrace.emit(observer, 'remove', this.entries[0]?.id ?? null, 'Replace the root', this.length ? 'Move the last leaf to the root and remove its old slot.' : 'The last root has been removed; the heap is now empty.', 'last = heap.pop()\nif heap is not empty: heap[0] = last')
    let index = 0
    while (index * 2 + 1 < this.length) {
      let child = index * 2 + 1
      if (child + 1 < this.length && this.entries[child + 1].value < this.entries[child].value) child += 1
      TreeTrace.emit(observer, 'compare', this.entries[child].id, 'Choose the smaller child', `Compare parent ${this.entries[index].value} with smaller child ${this.entries[child].value}.`, 'child = smaller(left, right)')
      if (this.entries[index].value <= this.entries[child].value) break
      this.swap(index, child, observer)
      index = child
    }
    return root.value
  }

  public clear(observer?: TreeTraceObserver): void {
    while (this.entries.length) {
      const removed = this.entries.pop()!
      TreeTrace.emit(observer, 'remove', this.entries[this.length - 1]?.id ?? null, 'Release a leaf', `Release ${removed.value} from the last occupied slot.`, 'heap.pop()')
    }
  }

  public getDiagram(): readonly TreeDiagramEntry[] {
    const entries: TreeDiagramEntry[] = []
    for (let index = 0; index < this.length; index += 1) {
      const entry = this.entries[index]
      const children: string[] = []
      for (const child of [2 * index + 1, 2 * index + 2]) if (child < this.length) children.push(this.entries[child].id)
      entries.push({ id: entry.id, text: String(entry.value), label: `${index === 0 ? 'MIN / ' : ''}index ${index}`, children })
    }
    return entries
  }

  public execute(action: ActionKind, input: TreeInputValues, observer?: TreeTraceObserver): TreeOperationResult {
    if (action === 'insert') {
      const value = AdditionalTreeModel.integer(input, 'value')
      this.insert(value, observer)
      return { description: `Inserted ${value}; min-heap order restored. Duplicates are allowed.` }
    }
    if (action === 'clear') {
      this.clear(observer)
      return { description: 'The heap is empty.' }
    }
    const value = action === 'extract-min' ? this.extractMin(observer) : this.peek()
    return { description: value === undefined ? 'The heap is empty; no minimum exists.' : action === 'extract-min' ? `Extracted minimum ${value}; heap order restored.` : `Minimum ${value} is at index 0; the heap is unchanged.`, returnValue: value ?? null, activeId: this.entries[0]?.id, status: action === 'peek' ? 'MINIMUM' : undefined }
  }
}
