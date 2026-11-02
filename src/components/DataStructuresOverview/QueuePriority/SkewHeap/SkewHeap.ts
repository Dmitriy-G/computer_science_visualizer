import { MeldableBinaryHeap } from '../MeldableBinaryHeap.ts'
import type { MeldNode } from '../MeldableBinaryHeap.ts'
import type { LinearObserver } from '../../../../visualization/LinearModel.ts'

export class SkewHeap extends MeldableBinaryHeap {
  public readonly kind = 'skew-heap'
  protected readonly leftist = false
  public get hint(): string { return 'A self-adjusting meldable min-heap with no rank metadata. Meld recursively combines right subtrees and swaps children on every return. Logarithmic bounds are amortized; one operation can follow a linear chain. Up to 64 nodes.' }
  protected empty(): SkewHeap { return new SkewHeap() }

  public static createDefault(): SkewHeap {
    const model = new SkewHeap()
    for (const value of [40, 20, 70, 10, 50, 90, 30, 60, 80, 100]) model.execute('insert', { value })
    return model
  }

  protected merge(first: MeldNode | null, second: MeldNode | null, observer?: LinearObserver): MeldNode | null {
    if (!first) return second
    if (!second) return first
    this.compare(first, second, observer)
    if (second.value < first.value) {
      const saved = first
      first = second
      second = saved
    }
    const merged = this.merge(first.right, second, observer)
    first.right = first.left
    first.left = merged
    return first
  }
}
