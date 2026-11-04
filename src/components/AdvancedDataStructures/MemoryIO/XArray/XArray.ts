import { AppliedModel } from '../../../../visualization/AppliedModel.ts'
import type { AppliedDiagram, DiagramItem } from '../../../../visualization/AppliedModel.ts'
import { LinearModel } from '../../../../visualization/LinearModel.ts'
import type { LinearInputValues, LinearObserver, LinearResult } from '../../../../visualization/LinearModel.ts'
import type { ActionKind } from '../../../../visualization/ActionCatalog.ts'

export class XArray extends AppliedModel {
  public readonly kind = 'xarray'
  public readonly representation = 'A two-level radix-64 indexed tree for slots 0..4095. Leaf arrays allocate only for occupied index groups and store integer values. This sequential XArray teaching subset omits native pointers, tagged entries, marks, and RCU.'
  private branches = new Map<number, (number | null)[]>()
  private count = 0
  public get length(): number { return this.count }
  public static createDefault(): XArray {
    const model = new XArray()
    for (let index = 0; index < 10; index += 1) model.execute('update-index', { index: index * 67, value: (index + 1) * 10 })
    return model
  }
  public clone(): XArray {
    const copy = new XArray()
    for (const [index, branch] of this.branches) copy.branches.set(index, [...branch])
    copy.count = this.count
    return copy
  }
  public getDiagram(): AppliedDiagram {
    const branches: DiagramItem[] = []
    const entries: DiagramItem[] = []
    for (const high of [...this.branches.keys()].sort((a, b) => a - b)) {
      const branch = this.branches.get(high)!
      const children: string[] = []
      for (let low = 0; low < 64; low += 1) {
        if (branch[low] === null) continue
        const index = high * 64 + low
        const id = `xa-${index}`
        children.push(id)
        entries.push({ id, text: String(branch[low]), label: `index ${index} / low ${low}` })
      }
      branches.push({ id: `xa-branch-${high}`, text: `${high * 64}..${high * 64 + 63}`, label: `radix slot ${high}`, children })
    }
    return { rows: [[{ id: 'xa-root', text: '64 slots', label: 'high six bits', children: branches.map((entry) => entry.id) }], branches, entries] }
  }
  public execute(action: ActionKind, input: LinearInputValues, observer?: LinearObserver): LinearResult {
    if (action === 'inspect-storage') return this.inspect(observer)
    if (action === 'clear') {
      for (const high of [...this.branches.keys()]) {
        LinearModel.emit(observer, `xa-branch-${high}`, 'Release this occupied radix branch.', 'release branch[high]')
        this.branches.delete(high)
      }
      this.count = 0
      return { description: 'Released every occupied branch; all indexed slots are absent.' }
    }
    const index = AppliedModel.bounded(input, 'index', 0, 4095)
    const high = Math.floor(index / 64)
    const low = index % 64
    LinearModel.emit(observer, 'xa-root', `Split index ${index} into high ${high} and low ${low}.`, 'high = index >> 6; low = index & 63')
    let branch = this.branches.get(high)
    if (branch) LinearModel.emit(observer, `xa-branch-${high}`, 'Follow the allocated leaf array.', 'leaf = root[high]')
    if (action === 'update-index') {
      const value = LinearModel.integer(input, 'value')
      if ((!branch || branch[low] === null) && this.count === 64) return this.reject('At most 64 occupied entries are supported.')
      if (!branch) {
        branch = new Array<number | null>(64).fill(null)
        this.branches.set(high, branch)
      }
      if (branch[low] === null) this.count += 1
      branch[low] = value
      LinearModel.emit(observer, `xa-${index}`, `Store ${value} at index ${index}.`, 'leaf[low] = value', 'NEW')
      return { description: `Stored ${value} at index ${index}.`, activeId: `xa-${index}` }
    }
    const value = branch?.[low] ?? null
    if (action === 'delete-index') {
      if (branch && value !== null) {
        branch[low] = null
        this.count -= 1
        if (branch.every((entry) => entry === null)) this.branches.delete(high)
      }
      return { description: value === null ? `Index ${index} was already absent.` : `Erased index ${index}; released its branch if empty.` }
    }
    if (action !== 'search-index') throw new RangeError('Unsupported XArray action')
    return { description: value === null ? `Index ${index} is absent.` : `Index ${index} contains ${value}.`, value, activeId: value === null ? null : `xa-${index}`, status: value === null ? 'ABSENT' : 'FOUND' }
  }
}
