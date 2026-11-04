import { ArraySortingAnimation } from '../ArraySortingAnimation.ts'
import { FixedArray } from '../../../../FundamentalDataStructures/Linear/Array/FixedArray.ts'

export class BogoSortAnimation extends ArraySortingAnimation {
  public static describe(size: number) {
    return this.information('Bogo Sort', 'Check sortedness and try up to 24 seeded Fisher-Yates shuffles; report unfinished and restore input if none succeeds.', size,
      ['O(n)', 'O(n · n!)', 'Unbounded'],
      'The rows describe ideal unbounded Bogo Sort: an already sorted input needs an O(n) check; independent uniform shuffles of distinct entries take O(n · n!) expected work; worst-case termination has no finite bound. This app instead uses 24 reproducible pseudorandom attempts, so actual demo work is O(n) with a fixed cap and success is not guaranteed. It never silently substitutes another sorting algorithm. Empty and singleton inputs take O(1).',
      ['O(1)', 'O(n)', 'O(n)'], 'An already sorted input uses O(1) space. Unsorted input keeps O(n) original references so an exhausted attempt can restore input. Fisher-Yates itself is in place. Equal-key order is not guaranteed. This rollback storage is a teaching choice, not a claim about ideal in-place Bogo Sort.',
      [
        { symbol: 'n!', meaning: 'Factorial: the number of permutations of n distinct entries, equal to 1 × 2 × … × n.' },
        { symbol: 'Unbounded', meaning: 'Ideal Bogo Sort has no finite worst-case termination bound; the capped demonstration reports exhaustion.' },
      ])
  }

  constructor(model: FixedArray) {
    super(model, 'Bogo Sort', { counterHint: 'At most 24 seeded shuffles; exhaustion restores input and reports an unfinished sort.' })
    let rejection = ''
    const accepted = this.result.bogoSort((event) => {
      if (event.kind === 'reject') rejection = event.detail!
      this.recordTrace(event)
    })
    if (accepted) this.finish(false)
    else this.add(5, 'Array unchanged', rejection, 'return original array // sort unfinished', this.layout.create(this.result.getEntries(), this.baseFrame))
    this.fitScenes()
  }
}
