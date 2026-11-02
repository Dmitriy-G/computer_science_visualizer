import { LinearModel } from '../../../../visualization/LinearModel.ts'
import type { LinearInputValues, LinearObserver, LinearResult } from '../../../../visualization/LinearModel.ts'
import type { ActionKind } from '../../../../visualization/ActionCatalog.ts'

export interface FreeSlot {
  readonly id: number
  value: number | null
  next: number | null
}

export class FreeList extends LinearModel {
  public readonly kind = 'free-list'
  public static readonly capacity = 10
  private readonly slots: FreeSlot[] = []
  private head: number | null = 0
  private allocated = 0
  public get length(): number { return this.allocated }
  public get freeHead(): number | null { return this.head }
  public getSlots(): readonly FreeSlot[] { return this.slots }

  constructor() {
    super()
    for (let id = 0; id < FreeList.capacity; id += 1) this.slots.push({ id, value: null, next: id + 1 < FreeList.capacity ? id + 1 : null })
  }

  public static createDefault(): FreeList {
    const model = new FreeList()
    for (const value of [10, 20, 30]) model.execute('allocate', { value })
    return model
  }

  public clone(): FreeList {
    const model = new FreeList()
    for (let index = 0; index < this.slots.length; index += 1) model.slots[index] = { ...this.slots[index] }
    model.head = this.head
    model.allocated = this.allocated
    return model
  }

  private release(id: number, observer?: LinearObserver): boolean {
    const slot = this.slots[id]
    if (slot.value === null) return false
    slot.value = null
    slot.next = this.head
    this.head = id
    this.allocated -= 1
    LinearModel.emit(observer, `pool-${id}`, `Return slot ${id} to the head of the free chain.`, 'slot.value = empty; slot.next = freeHead; freeHead = slot', 'FREE')
    return true
  }

  public execute(action: ActionKind, input: LinearInputValues, observer?: LinearObserver): LinearResult {
    if (action === 'clear') {
      for (const slot of this.slots) if (slot.value !== null) this.release(slot.id, observer)
      return { description: 'Every slot is free; the ten-slot pool is retained.' }
    }
    if (action === 'allocate') {
      const value = LinearModel.integer(input, 'value')
      if (this.head === null) return { description: 'Allocation rejected: the fixed ten-slot pool is exhausted.', status: 'FULL', value: null }
      const id = this.head
      const slot = this.slots[id]
      LinearModel.emit(observer, `pool-${id}`, `Take slot ${id} from the free-list head.`, 'slot = freeHead')
      this.head = slot.next
      slot.next = null
      slot.value = value
      this.allocated += 1
      LinearModel.emit(observer, `pool-${id}`, `Store ${value}; advance the free head to ${this.head ?? 'null'}.`, 'freeHead = slot.next; slot.value = value; slot.next = null', 'ALLOCATED')
      return { description: `Allocated slot ${id} for ${value}.`, activeId: `pool-${id}`, value: id }
    }
    if (action !== 'release') throw new RangeError('Unsupported free-list action')
    const id = LinearModel.integer(input, 'index')
    LinearModel.index(id, FreeList.capacity)
    if (!this.release(id, observer)) return { description: `Slot ${id} is already free; double release rejected.`, activeId: `pool-${id}`, status: 'ALREADY FREE', value: false }
    return { description: `Released slot ${id}; the next allocation will reuse it.`, activeId: `pool-${id}`, value: true }
  }
}
