import { AdditionalTreeModel } from '../../../visualization/AdditionalTreeModel.ts'
import type { TreeInputValues } from '../../../visualization/AdditionalTreeModel.ts'
import { TreeTrace } from '../../../visualization/TreeTrace.ts'
import type { TreeTraceObserver, TreeTracePhase } from '../../../visualization/TreeTrace.ts'
// Shared validation and trace primitives, never a substitute for a structure's storage.
export abstract class ExtendedTreeModel extends AdditionalTreeModel {
  public static readonly maximumElements = 64
  protected nextId = 0
  protected allocateId(): string { return `${this.kind}-${this.nextId++}` }
  protected capacity(size = this.length): void {
    if (size >= ExtendedTreeModel.maximumElements) throw new RangeError('This demonstration supports at most 64 elements')
  }
  protected word(input: TreeInputValues, name = 'word'): string {
    const word = input[name]
    if (typeof word !== 'string' || !/^[a-z]{1,32}$/.test(word)) throw new TypeError('Use 1 to 32 lowercase letters a-z')
    return word
  }
  protected index(input: TreeInputValues, name = 'index', length = this.length): number {
    const index = AdditionalTreeModel.integer(input, name)
    if (index < 0 || index >= length) throw new RangeError(`${name} must be between 0 and ${length - 1}`)
    return index
  }
  protected emit(observer: TreeTraceObserver | undefined, id: string | null, description: string, code: string, phase: TreeTracePhase = 'visit'): void {
    TreeTrace.emit(observer, phase, id, description, description, code)
  }
}
