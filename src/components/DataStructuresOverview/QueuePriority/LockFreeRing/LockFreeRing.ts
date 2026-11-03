import { AppliedModel } from '../../../../visualization/AppliedModel.ts'
import type { AppliedDiagram } from '../../../../visualization/AppliedModel.ts'
import { LinearModel } from '../../../../visualization/LinearModel.ts'
import type { LinearInputValues, LinearObserver, LinearResult } from '../../../../visualization/LinearModel.ts'
import type { ActionKind } from '../../../../visualization/ActionCatalog.ts'

export class LockFreeRing extends AppliedModel {
  public readonly kind = 'lock-free-ring'
  public readonly representation = 'A sixteen-slot single-producer/single-consumer ring with per-slot sequence numbers. Publish after writing and release after reading. Acquire/release ordering is illustrated sequentially; no actual threads, Atomics, or multi-producer guarantees are provided.'
  private slots: { sequence: number, value: number | null }[] = Array.from({ length: 16 }, (_, sequence) => ({ sequence, value: null }))
  private producer = 0
  private consumer = 0
  public get length(): number { return this.producer - this.consumer }
  public static createDefault(): LockFreeRing {
    const model = new LockFreeRing()
    for (let value = 1; value <= 10; value += 1) model.execute('enqueue', { value: value * 10 })
    return model
  }
  public clone(): LockFreeRing {
    const copy = new LockFreeRing()
    copy.slots = this.slots.map((slot) => ({ ...slot }))
    copy.producer = this.producer
    copy.consumer = this.consumer
    return copy
  }
  public getDiagram(): AppliedDiagram {
    return { rows: [[{ id: 'ring-producer', text: String(this.producer), label: `producer / slot ${this.producer % 16}` }, { id: 'ring-consumer', text: String(this.consumer), label: `consumer / slot ${this.consumer % 16}` }], this.slots.map((slot, index) => ({ id: `spsc-${index}`, text: slot.value === null ? 'empty' : String(slot.value), label: `slot ${index} / seq ${slot.sequence}` }))] }
  }
  public execute(action: ActionKind, input: LinearInputValues, observer?: LinearObserver): LinearResult {
    if (action === 'inspect-storage') return this.inspect(observer)
    if (action === 'clear') {
      while (this.length) this.execute('dequeue', {}, observer)
      return { description: 'Drained the ring in FIFO order; sequence counters are retained.' }
    }
    if (action === 'enqueue') {
      const value = LinearModel.integer(input, 'value')
      if (this.producer > Number.MAX_SAFE_INTEGER - 32) return this.reject('The exact sequence-counter limit has been reached.')
      const index = this.producer % 16
      const slot = this.slots[index]
      LinearModel.emit(observer, `spsc-${index}`, `Acquire slot sequence ${slot.sequence}; producer expects ${this.producer}.`, 'acquire sequence; compare with producer position')
      if (slot.sequence !== this.producer) return this.reject('The ring is full; no unread value was overwritten.')
      slot.value = value
      slot.sequence = this.producer + 1
      this.producer += 1
      LinearModel.emit(observer, `spsc-${index}`, `Publish ${value} by advancing the slot sequence.`, 'write payload; release sequence = position + 1', 'NEW')
      return { description: `Enqueued ${value} in slot ${index}.`, activeId: `spsc-${index}` }
    }
    if (action !== 'dequeue') throw new RangeError('Unsupported SPSC ring action')
    const index = this.consumer % 16
    const slot = this.slots[index]
    LinearModel.emit(observer, `spsc-${index}`, `Acquire slot sequence ${slot.sequence}; consumer expects ${this.consumer + 1}.`, 'acquire sequence; compare with consumer position + 1')
    if (slot.sequence !== this.consumer + 1) return { description: 'The ring is empty.', value: null, activeId: `spsc-${index}`, status: 'EMPTY' }
    const value = slot.value
    slot.value = null
    slot.sequence = this.consumer + 16
    this.consumer += 1
    LinearModel.emit(observer, `spsc-${index}`, 'Release the consumed slot for the next producer lap.', 'read payload; release sequence = position + capacity')
    return { description: `Dequeued ${value} from slot ${index}.`, value, activeId: `spsc-${index}` }
  }
}
