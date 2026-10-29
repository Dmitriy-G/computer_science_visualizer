import { LinkedList } from '../LinkedList.ts'
import { BoundaryInsertionAnimation } from '../BoundaryInsertionAnimation.ts'
import { AnimationSequence } from '../../../../visualization/AnimationSequence.ts'

export class InsertionAnimation extends BoundaryInsertionAnimation {
  public static describe(size: number) {
    return AnimationSequence.information('Insert at the start', 'Connect to the old head and update the head pointer without traversal.', size, ['O(1)', 'O(1)', 'O(1)'], 'Connect to the old head and update the head pointer without traversal.', 'O(1)', 'Allocate one new node and a fixed number of pointers.')
  }

  constructor(model: LinkedList, value: number) { super(model, value, false) }
}
