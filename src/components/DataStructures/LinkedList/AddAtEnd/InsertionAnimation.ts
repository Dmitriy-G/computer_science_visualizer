import { LinkedList } from '../LinkedList.ts'
import { BoundaryInsertionAnimation } from '../BoundaryInsertionAnimation.ts'
import { AnimationSequence } from '../../../../visualization/AnimationSequence.ts'

export class InsertionAnimation extends BoundaryInsertionAnimation {
  public static describe(size: number) {
    return AnimationSequence.information(
      'Insert at the end',
      'Follow next pointers to the last node, then append a new node.',
      size,
      ['O(n)', 'O(n)', 'O(n)'],
      'For nonempty lists, best, average, and worst cases are linear: there is no cached tail pointer, so every run traverses from the head to the last node. Updating the final pointer is constant time. An empty list is a boundary case requiring only a head update, just as empty middle insertion does.',
      'O(1)',
      'Allocate one new node and a fixed number of pointers.',
    )
  }

  constructor(model: LinkedList, value: number) { super(model, value, true) }
}
