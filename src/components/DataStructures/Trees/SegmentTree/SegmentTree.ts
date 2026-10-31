import { AdditionalTreeModel } from '../../../../visualization/AdditionalTreeModel.ts'
import type { TreeDiagramEntry, TreeInputValues, TreeOperationResult } from '../../../../visualization/AdditionalTreeModel.ts'
import type { ActionKind } from '../../../../visualization/ActionCatalog.ts'
import { TreeTrace } from '../../../../visualization/TreeTrace.ts'
import type { TreeTraceObserver } from '../../../../visualization/TreeTrace.ts'

export class SegmentTree extends AdditionalTreeModel {
  public readonly kind = 'segment-tree'
  private readonly values: bigint[] = []
  private readonly sums = new Map<string, bigint>()

  constructor(values: readonly number[] = []) {
    super()
    for (const value of values) {
      TreeTrace.validate(value)
      this.values.push(BigInt(value))
    }
    if (this.length) this.build(0, this.length - 1)
  }

  public get length(): number { return this.values.length }
  public static createDefault(): SegmentTree { return new SegmentTree([10, 20, 30, 40, 50, 60, 70, 80, 90, 100]) }
  private id(left: number, right: number): string { return `segment-${left}-${right}` }

  private build(left: number, right: number): bigint {
    const middle = Math.floor((left + right) / 2)
    const sum = left === right ? this.values[left] : this.build(left, middle) + this.build(middle + 1, right)
    this.sums.set(this.id(left, right), sum)
    return sum
  }

  public clone(): SegmentTree {
    const result = new SegmentTree()
    for (const value of this.values) result.values.push(value)
    for (const [id, sum] of this.sums) result.sums.set(id, sum)
    return result
  }

  public getValues(): readonly bigint[] { return [...this.values] }

  private validateIndex(index: number): void {
    if (!Number.isSafeInteger(index) || index < 0 || index >= this.length) throw new RangeError('Index is outside the current array')
  }

  public update(index: number, value: number, observer?: TreeTraceObserver): void {
    this.validateIndex(index)
    TreeTrace.validate(value)
    const change = (left: number, right: number): bigint => {
      const id = this.id(left, right)
      TreeTrace.emit(observer, 'visit', id, 'Locate the indexed leaf', `Index ${index} belongs to [${left}, ${right}].`, 'descend into the child containing index')
      if (left === right) this.values[index] = BigInt(value)
      else {
        const middle = Math.floor((left + right) / 2)
        if (index <= middle) change(left, middle)
        else change(middle + 1, right)
      }
      const middle = Math.floor((left + right) / 2)
      const sum = left === right ? this.values[index] : this.sums.get(this.id(left, middle))! + this.sums.get(this.id(middle + 1, right))!
      this.sums.set(id, sum)
      TreeTrace.emit(observer, 'connect', id, left === right ? 'Set the leaf value' : 'Recompute the parent sum', `The sum for [${left}, ${right}] is now ${sum}.`, left === right ? 'leaf.sum = value' : 'node.sum = left.sum + right.sum')
      return sum
    }
    change(0, this.length - 1)
  }

  public rangeSum(minimum: number, maximum: number, observer?: TreeTraceObserver): bigint {
    this.validateIndex(minimum)
    this.validateIndex(maximum)
    if (minimum > maximum) throw new RangeError('Minimum index must not exceed maximum index')
    const query = (left: number, right: number): bigint => {
      const id = this.id(left, right)
      if (maximum < left || minimum > right) {
        TreeTrace.emit(observer, 'compare', id, 'Skip a disjoint segment', `[${left}, ${right}] is outside [${minimum}, ${maximum}]; contribute 0.`, 'if disjoint: return 0')
        return 0n
      }
      if (minimum <= left && right <= maximum) {
        TreeTrace.emit(observer, 'visit', id, 'Use a covered segment', `Use cached sum ${this.sums.get(id)} for [${left}, ${right}].`, 'if fully covered: return node.sum')
        return this.sums.get(id)!
      }
      TreeTrace.emit(observer, 'visit', id, 'Split the query', `The query partially covers [${left}, ${right}]; inspect both children.`, 'return query(left) + query(right)')
      const middle = Math.floor((left + right) / 2)
      return query(left, middle) + query(middle + 1, right)
    }
    return query(0, this.length - 1)
  }

  public clear(observer?: TreeTraceObserver): void {
    for (let index = 0; index < this.length; index += 1) this.values[index] = 0n
    const reset = (left: number, right: number): void => {
      if (left !== right) {
        const middle = Math.floor((left + right) / 2)
        reset(left, middle)
        reset(middle + 1, right)
      }
      const id = this.id(left, right)
      this.sums.set(id, 0n)
      TreeTrace.emit(observer, 'remove', id, 'Reset a segment sum', `Set [${left}, ${right}] to zero, preserving the indexed array length.`, 'node.sum = 0')
    }
    if (this.length) reset(0, this.length - 1)
  }

  public getDiagram(): readonly TreeDiagramEntry[] {
    const entries: TreeDiagramEntry[] = []
    const visit = (left: number, right: number): void => {
      const middle = Math.floor((left + right) / 2)
      const children = left === right ? [] : [this.id(left, middle), this.id(middle + 1, right)]
      entries.push({ id: this.id(left, right), text: String(this.sums.get(this.id(left, right))), label: `[${left}, ${right}]`, children })
      if (left !== right) {
        visit(left, middle)
        visit(middle + 1, right)
      }
    }
    if (this.length) visit(0, this.length - 1)
    return entries
  }

  public execute(action: ActionKind, input: TreeInputValues, observer?: TreeTraceObserver): TreeOperationResult {
    if (action === 'clear') {
      this.clear(observer)
      return { description: `Reset all ${this.length} values and segment sums to zero; indices remain available.` }
    }
    if (action === 'update-index') {
      const index = AdditionalTreeModel.integer(input, 'index')
      const value = AdditionalTreeModel.integer(input, 'value')
      this.update(index, value, observer)
      return { description: `Set index ${index} to ${value}; ancestor sums updated.`, activeId: this.id(index, index) }
    }
    const minimum = AdditionalTreeModel.integer(input, 'minimum')
    const maximum = AdditionalTreeModel.integer(input, 'maximum')
    const sum = this.rangeSum(minimum, maximum, observer)
    return { description: `Sum of inclusive indices [${minimum}, ${maximum}] = ${sum}; values unchanged.`, returnValue: sum, status: 'SUM' }
  }
}
