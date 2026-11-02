import { LinearModel } from '../../../../visualization/LinearModel.ts'
import type { LinearInputValues, LinearObserver, LinearResult } from '../../../../visualization/LinearModel.ts'
import type { ActionKind } from '../../../../visualization/ActionCatalog.ts'

export interface UnrolledBlock {
  readonly id: string
  readonly values: number[]
  next: UnrolledBlock | null
}

export class UnrolledLinkedList extends LinearModel {
  public readonly kind = 'unrolled-linked-list'
  public static readonly blockCapacity = 4
  private head: UnrolledBlock | null = null
  private count = 0
  private nextId = 1
  public get length(): number { return this.count }

  public static createDefault(): UnrolledLinkedList {
    const model = new UnrolledLinkedList()
    for (let value = 10; value <= 100; value += 10) model.execute('insert', { index: model.length, value })
    return model
  }

  public getBlocks(): readonly UnrolledBlock[] {
    const blocks: UnrolledBlock[] = []
    for (let block = this.head; block; block = block.next) blocks.push(block)
    return blocks
  }

  public getValues(): readonly number[] {
    const values: number[] = []
    for (const block of this.getBlocks()) values.push(...block.values)
    return values
  }

  public clone(): UnrolledLinkedList {
    const model = new UnrolledLinkedList()
    let tail: UnrolledBlock | null = null
    for (const block of this.getBlocks()) {
      const copy = { id: block.id, values: [...block.values], next: null }
      if (tail) tail.next = copy
      else model.head = copy
      tail = copy
    }
    model.count = this.count
    model.nextId = this.nextId
    return model
  }

  public execute(action: ActionKind, input: LinearInputValues, observer?: LinearObserver): LinearResult {
    if (action === 'clear') {
      while (this.head) {
        this.count -= this.head.values.length
        this.head = this.head.next
        LinearModel.emit(observer, this.head?.id ?? null, 'Release the first block and advance the head.', 'head = head.next')
      }
      return { description: 'All blocks have been released.' }
    }
    if (action === 'insert') {
      const index = LinearModel.integer(input, 'index')
      const value = LinearModel.integer(input, 'value')
      LinearModel.index(index, this.count, true)
      if (this.count >= LinearModel.maximumElements) return { description: 'Insertion rejected: this example allows 64 values.' }
      if (!this.head) this.head = { id: `block-${this.nextId++}`, values: [], next: null }
      let block = this.head
      let offset = index
      while (offset > block.values.length && block.next) {
        LinearModel.emit(observer, block.id, `Skip a block containing ${block.values.length} values.`, 'offset -= block.count; block = block.next')
        offset -= block.values.length
        block = block.next
      }
      LinearModel.emit(observer, block.id, `Insert at local offset ${offset} in this block.`, 'locate block containing index')
      if (block.values.length === UnrolledLinkedList.blockCapacity) {
        const right: UnrolledBlock = { id: `block-${this.nextId++}`, values: block.values.splice(2), next: block.next }
        block.next = right
        LinearModel.emit(observer, block.id, 'Split the full four-value block into two blocks.', 'right.values = block.values.splice(2)\nright.next = block.next; block.next = right')
        if (offset > block.values.length) {
          offset -= block.values.length
          block = right
        }
      }
      block.values.splice(offset, 0, value)
      this.count += 1
      LinearModel.emit(observer, block.id, `Shift only this block and insert ${value}.`, 'block.values.splice(offset, 0, value)', 'NEW')
      return { description: `Inserted ${value} at index ${index}.`, activeId: block.id }
    }
    if (action !== 'search-value' && action !== 'delete-value') throw new RangeError('Unsupported unrolled-list action')
    const value = LinearModel.integer(input, 'value')
    let previous: UnrolledBlock | null = null
    let base = 0
    for (let block = this.head; block; block = block.next) {
      for (let offset = 0; offset < block.values.length; offset += 1) {
        LinearModel.emit(observer, block.id, `Compare ${block.values[offset]} at global index ${base + offset}.`, 'compare(block.values[offset], value)')
        if (block.values[offset] !== value) continue
        if (action === 'search-value') return { description: `Found ${value} at index ${base + offset}, block offset ${offset}.`, activeId: block.id, status: 'FOUND', value: base + offset }
        block.values.splice(offset, 1)
        this.count -= 1
        if (!block.values.length) {
          if (previous) previous.next = block.next
          else this.head = block.next
        } else if (block.next && block.values.length + block.next.values.length <= UnrolledLinkedList.blockCapacity) {
          block.values.push(...block.next.values)
          block.next = block.next.next
        }
        LinearModel.emit(observer, null, 'Delete the first match; unlink empty blocks or merge an adjacent block when it fits.', 'remove match; merge neighbor if combined count <= 4')
        return { description: `Deleted the first ${value} at index ${base + offset}.` }
      }
      base += block.values.length
      previous = block
    }
    return { description: `${value} was not found.`, status: 'NOT FOUND', value: -1 }
  }
}
