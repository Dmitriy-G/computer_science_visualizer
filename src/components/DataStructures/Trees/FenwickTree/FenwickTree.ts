import { AdditionalTreeModel } from '../../../../visualization/AdditionalTreeModel.ts'
import type { TreeDiagramEntry, TreeInputValues, TreeOperationResult } from '../../../../visualization/AdditionalTreeModel.ts'
import type { ActionKind } from '../../../../visualization/ActionCatalog.ts'
import { TreeTrace } from '../../../../visualization/TreeTrace.ts'
import type { TreeTraceObserver } from '../../../../visualization/TreeTrace.ts'

export class FenwickTree extends AdditionalTreeModel {
  public readonly kind = 'fenwick-tree'
  private readonly values: bigint[] = []
  private readonly tree: bigint[] = [0n]
  public get length(): number { return this.values.length }

  constructor(values: readonly number[] = []) {
    super()
    for (const value of values) {
      TreeTrace.validate(value)
      this.values.push(BigInt(value))
      this.tree.push(BigInt(value))
    }
    for (let index = 1; index <= this.length; index += 1) {
      const parent = index + this.lowbit(index)
      if (parent <= this.length) this.tree[parent] += this.tree[index]
    }
  }

  public static createDefault(): FenwickTree { return new FenwickTree([10, 20, 30, 40, 50, 60, 70, 80, 90, 100]) }
  private lowbit(index: number): number { return index & -index }

  public clone(): FenwickTree {
    const result = new FenwickTree()
    for (const value of this.values) result.values.push(value)
    for (let index = 1; index < this.tree.length; index += 1) result.tree.push(this.tree[index])
    return result
  }

  public getValues(): readonly bigint[] { return [...this.values] }

  private validateIndex(index: number): void {
    if (!Number.isSafeInteger(index) || index < 0 || index >= this.length) throw new RangeError('Index is outside the current array')
  }

  public add(index: number, delta: number, observer?: TreeTraceObserver): void {
    this.validateIndex(index)
    TreeTrace.validate(delta)
    this.values[index] += BigInt(delta)
    for (let current = index + 1; current <= this.length; current += this.lowbit(current)) {
      TreeTrace.emit(observer, 'visit', `fenwick-${current}`, 'Visit an update ancestor', `BIT index ${current} covers array indices [${current - this.lowbit(current)}, ${current - 1}].`, 'i = index + 1; i += i & -i')
      this.tree[current] += BigInt(delta)
      TreeTrace.emit(observer, 'connect', `fenwick-${current}`, 'Add the delta', `Add ${delta}; this cached sum is now ${this.tree[current]}.`, 'bit[i] += delta')
    }
  }

  private prefixBefore(end: number, observer?: TreeTraceObserver): bigint {
    let sum = 0n
    for (let current = end; current > 0; current -= this.lowbit(current)) {
      sum += this.tree[current]
      TreeTrace.emit(observer, 'visit', `fenwick-${current}`, 'Accumulate a prefix block', `Add BIT[${current}] = ${this.tree[current]}; running sum = ${sum}.`, 'sum += bit[i]; i -= i & -i')
    }
    return sum
  }

  public prefixSum(index: number, observer?: TreeTraceObserver): bigint {
    this.validateIndex(index)
    return this.prefixBefore(index + 1, observer)
  }

  public rangeSum(minimum: number, maximum: number, observer?: TreeTraceObserver): bigint {
    this.validateIndex(minimum)
    this.validateIndex(maximum)
    if (minimum > maximum) throw new RangeError('Minimum index must not exceed maximum index')
    const upper = this.prefixBefore(maximum + 1, observer)
    const lower = this.prefixBefore(minimum, observer)
    return upper - lower
  }

  public clear(observer?: TreeTraceObserver): void {
    for (let index = 1; index <= this.length; index += 1) {
      this.values[index - 1] = 0n
      this.tree[index] = 0n
      TreeTrace.emit(observer, 'remove', `fenwick-${index}`, 'Reset a BIT cell', `Set array index ${index - 1} and BIT[${index}] to zero.`, 'values[i - 1] = 0; bit[i] = 0')
    }
  }

  public getDiagram(): readonly TreeDiagramEntry[] {
    const children = new Map<number, string[]>()
    for (let index = 1; index <= this.length; index += 1) children.set(index, [])
    for (let index = 1; index <= this.length; index += 1) children.get(index + this.lowbit(index))?.push(`fenwick-${index}`)
    const entries: TreeDiagramEntry[] = []
    for (let index = 1; index <= this.length; index += 1) entries.push({ id: `fenwick-${index}`, text: String(this.tree[index]), label: `BIT ${index} / [${index - this.lowbit(index)}, ${index - 1}]`, children: children.get(index)! })
    return entries
  }

  public execute(action: ActionKind, input: TreeInputValues, observer?: TreeTraceObserver): TreeOperationResult {
    if (action === 'clear') {
      this.clear(observer)
      return { description: `Reset all ${this.length} array values and BIT cells to zero; indices remain available.` }
    }
    if (action === 'add-index') {
      const index = AdditionalTreeModel.integer(input, 'index')
      const delta = AdditionalTreeModel.integer(input, 'delta')
      this.add(index, delta, observer)
      return { description: `Added ${delta} at array index ${index}; its value is now ${this.values[index]}.`, activeId: `fenwick-${index + 1}` }
    }
    if (action === 'prefix-sum') {
      const index = AdditionalTreeModel.integer(input, 'index')
      const sum = this.prefixSum(index, observer)
      return { description: `Prefix sum of inclusive array indices [0, ${index}] = ${sum}; values unchanged.`, returnValue: sum, status: 'SUM' }
    }
    const minimum = AdditionalTreeModel.integer(input, 'minimum')
    const maximum = AdditionalTreeModel.integer(input, 'maximum')
    const sum = this.rangeSum(minimum, maximum, observer)
    return { description: `Sum of inclusive indices [${minimum}, ${maximum}] = ${sum}, using prefix(maximum) - prefix(minimum - 1).`, returnValue: sum, status: 'SUM' }
  }
}
