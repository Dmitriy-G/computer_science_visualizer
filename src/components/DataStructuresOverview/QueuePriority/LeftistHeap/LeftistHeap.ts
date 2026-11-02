import { MeldableBinaryHeap } from '../MeldableBinaryHeap.ts'
import type { MeldNode } from '../MeldableBinaryHeap.ts'
import type { LinearObserver } from '../../../../visualization/LinearModel.ts'

export class LeftistHeap extends MeldableBinaryHeap {
  public readonly kind = 'leftist-heap'
  protected readonly leftist = true
  public get hint(): string { return 'A meldable min-heap with null-path rank: rank(null) = 0, rank(leaf) = 1, and rank(left) >= rank(right). Only right spines are merged; child swaps restore the rank condition. Up to 64 nodes.' }
  protected empty(): LeftistHeap { return new LeftistHeap() }

  public static createDefault(): LeftistHeap {
    const model = new LeftistHeap()
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
    first.right = this.merge(first.right, second, observer)
    if ((first.left?.rank ?? 0) < (first.right?.rank ?? 0)) {
      const saved = first.left
      first.left = first.right
      first.right = saved
    }
    first.rank = (first.right?.rank ?? 0) + 1
    return first
  }
}
