import { LinkedList } from '../LinkedList.ts'
import { BoundaryInsertionAnimation } from '../BoundaryInsertionAnimation.ts'
import { AnimationSequence } from '../../../../visualization/AnimationSequence.ts'

export class InsertionAnimation extends BoundaryInsertionAnimation {
  public static describe(size: number) {
    return AnimationSequence.information(
      'Insert at the end',
      'Walk to the last node, then append.',
      size,
      ['O(n)', 'O(n)', 'O(n)'],
      'Every case walks to the tail: O(n), since there is no cached tail pointer. Connecting the node takes O(1). An empty list is a constant-time boundary case.',
      'O(1)',
      'Allocate one new node and a fixed number of pointers.',
    )
  }

  constructor(model: LinkedList, value: number) { super(model, value, true) }
}
