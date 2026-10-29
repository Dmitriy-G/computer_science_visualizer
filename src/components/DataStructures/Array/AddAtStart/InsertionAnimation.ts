import { FixedArray } from '../FixedArray.ts'
import { InsertionAnimation as MiddleInsertionAnimation } from '../AddInTheMiddle/InsertionAnimation.ts'
import { AnimationSequence } from '../../../../visualization/AnimationSequence.ts'

export class InsertionAnimation extends MiddleInsertionAnimation {
  public static describe(size: number) {
    return AnimationSequence.information('Insert at the start', 'Copy every original element into a separate fixed array of exactly one more slot.', size, ['O(n)', 'O(n)', 'O(n)'], 'Copy every original element into a separate fixed array of exactly one more slot.', 'O(n)', 'Allocate exactly one additional result slot per original element, plus the inserted slot.')
  }

  constructor(model: FixedArray, value: number) { super(model, value, 0) }
}
