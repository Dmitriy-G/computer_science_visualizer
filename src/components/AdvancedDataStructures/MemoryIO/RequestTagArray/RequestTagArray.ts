import { AppliedModel } from '../../../../visualization/AppliedModel.ts'
import type { AppliedDiagram } from '../../../../visualization/AppliedModel.ts'
import { LinearModel } from '../../../../visualization/LinearModel.ts'
import type { LinearInputValues, LinearObserver, LinearResult } from '../../../../visualization/LinearModel.ts'
import type { ActionKind } from '../../../../visualization/ActionCatalog.ts'

export class RequestTagArray extends AppliedModel {
  public readonly kind = 'request-tag-array'
  public readonly representation = 'Sixteen request slots plus an allocation bitmap. Allocate chooses the lowest free tag; completion releases that exact tag. A live tag directly indexes its request. This sequential model has no kernel pointers, waiting threads, or hardware I/O.'
  private slots: (number | null)[] = new Array<number | null>(16).fill(null)
  private allocated = 0
  public get length(): number {
    let count = 0
    for (const value of this.slots) if (value !== null) count += 1
    return count
  }
  public static createDefault(): RequestTagArray {
    const model = new RequestTagArray()
    for (let value = 1; value <= 10; value += 1) model.execute('allocate', { value: value * 10 })
    return model
  }
  public clone(): RequestTagArray {
    const copy = new RequestTagArray()
    copy.slots = [...this.slots]
    copy.allocated = this.allocated
    return copy
  }
  public getDiagram(): AppliedDiagram {
    return { rows: [[{ id: 'tags-bitmap', text: this.allocated.toString(2).padStart(16, '0'), label: 'allocated bits 15..0' }], this.slots.map((value, tag) => ({ id: `tag-${tag}`, text: value === null ? 'free' : String(value), label: `tag ${tag} / ${value === null ? 'FREE' : 'ALLOCATED'}` }))] }
  }
  public execute(action: ActionKind, input: LinearInputValues, observer?: LinearObserver): LinearResult {
    if (action === 'inspect-storage') return this.inspect(observer)
    if (action === 'clear') {
      this.slots.fill(null)
      this.allocated = 0
      return { description: 'Released all requests and cleared the allocation bitmap.' }
    }
    if (action === 'allocate') {
      const value = LinearModel.integer(input, 'value')
      for (let tag = 0; tag < 16; tag += 1) {
        LinearModel.emit(observer, `tag-${tag}`, `Test allocation bit ${tag}.`, 'if ((bitmap & (1 << tag)) == 0)')
        if ((this.allocated & (1 << tag)) !== 0) continue
        this.slots[tag] = value
        this.allocated |= 1 << tag
        LinearModel.emit(observer, `tag-${tag}`, `Assign request ${value} to tag ${tag}.`, 'requests[tag] = request; set allocation bit', 'NEW')
        return { description: `Allocated tag ${tag} for request ${value}.`, value: tag, activeId: `tag-${tag}` }
      }
      return this.reject('All sixteen tags are allocated; no request was changed.')
    }
    const tag = AppliedModel.bounded(input, 'index', 0, 15)
    const value = this.slots[tag]
    LinearModel.emit(observer, `tag-${tag}`, `Directly index tag ${tag}.`, 'request = requests[tag]')
    if (action === 'release') {
      if (value === null) return this.reject(`Tag ${tag} is already free.`)
      this.slots[tag] = null
      this.allocated &= ~(1 << tag)
      return { description: `Completed request ${value}; tag ${tag} is reusable.` }
    }
    if (action !== 'search-index') throw new RangeError('Unsupported request-tag action')
    return { description: value === null ? `Tag ${tag} is free.` : `Tag ${tag} identifies request ${value}.`, value, activeId: `tag-${tag}`, status: value === null ? 'FREE' : 'FOUND' }
  }
}
