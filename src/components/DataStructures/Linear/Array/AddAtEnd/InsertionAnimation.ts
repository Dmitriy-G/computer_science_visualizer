import { FixedArray } from '../FixedArray.ts'
import { InsertionAnimation as MiddleInsertionAnimation } from '../AddInTheMiddle/InsertionAnimation.ts'
import { AnimationSequence } from '../../../../../visualization/AnimationSequence.ts'

export class InsertionAnimation extends MiddleInsertionAnimation {
  public static describe(size: number) {
    return AnimationSequence.information(
      'Insert at the end',
      'Build a new fixed array with the value last.',
      size,
      ['O(n)', 'O(n)', 'O(n)'],
      'Every case copies all n elements: O(n). The fixed array is full, so appending needs a new array. An empty input needs one write.',
      'O(n)',
      'Exactly n + 1 result slots in every case: O(n).',
    )
  }

  constructor(model: FixedArray, value: number) { super(model, value, model.length) }
}
