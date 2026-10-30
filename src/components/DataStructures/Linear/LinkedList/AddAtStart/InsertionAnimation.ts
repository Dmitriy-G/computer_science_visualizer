import { LinkedList } from '../LinkedList.ts'
import { BoundaryInsertionAnimation } from '../BoundaryInsertionAnimation.ts'
import { AnimationSequence } from '../../../../../visualization/AnimationSequence.ts'

export class InsertionAnimation extends BoundaryInsertionAnimation {
  public static describe(size: number) {
    return AnimationSequence.information(
      'Insert at the start',
      'Connect the new node before the head.',
      size,
      ['O(1)', 'O(1)', 'O(1)'],
      'Every case is O(1): update the head and new-node pointers without traversal, including for an empty list.',
      'O(1)',
      'One new node and a few pointers in every case.',
    )
  }

  constructor(model: LinkedList, value: number) { super(model, value, false) }
}
