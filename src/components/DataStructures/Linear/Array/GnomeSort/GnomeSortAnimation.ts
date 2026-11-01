import { ArraySortingAnimation } from '../ArraySortingAnimation.ts'
import { FixedArray } from '../FixedArray.ts'

export class GnomeSortAnimation extends ArraySortingAnimation {
  public static describe(size: number) {
    return this.information('Gnome Sort', 'Walk forward over ordered neighbors, exchange an inverted pair and step backward, then resume walking forward.', size,
      ['O(n)', 'O(n²)', 'O(n²)'],
      'Already ordered input needs one forward walk, giving O(n) best time. Random distinct permutations give O(n²) average time, and reverse order causes O(n²) backtracking in the worst case. At the first slot the walk turns forward. Empty and singleton inputs take O(1).',
      'O(1)', 'One walking index and one temporary exchange reference use constant storage. Equal neighbors are accepted in order and never exchanged, so Gnome Sort is stable.')
  }

  constructor(model: FixedArray) {
    super(model, 'Gnome Sort')
    this.result.gnomeSort((event) => this.recordTrace(event))
    this.finish(true)
  }
}
