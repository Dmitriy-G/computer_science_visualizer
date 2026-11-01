import { ArraySortingAnimation } from '../ArraySortingAnimation.ts'
import { FixedArray } from '../FixedArray.ts'

export class CocktailShakerSortAnimation extends ArraySortingAnimation {
  public static describe(size: number) {
    return this.information('Cocktail Shaker Sort', 'Alternate forward and backward adjacent sweeps, moving a maximum right and a minimum left while shrinking the unsorted range.', size,
      ['O(n)', 'O(n²)', 'O(n²)'],
      'An already ordered array finishes after one forward sweep without swaps, giving O(n) best time. Random distinct permutations give O(n²) average time; reverse order requires quadratic work in the worst case. Each sweep fixes one boundary, and a sweep without swaps stops the sort. Empty and singleton inputs take O(1).',
      'O(1)', 'Two boundaries, scan indices, a swap flag, and one exchange reference use constant storage. Only strictly inverted adjacent keys are exchanged, preserving equal-key order.')
  }

  constructor(model: FixedArray) {
    super(model, 'Cocktail Shaker Sort')
    this.result.cocktailShakerSort((event) => this.recordTrace(event))
    this.finish(true)
  }
}
