import { HashAnimation } from '../../../../../visualization/HashAnimation.ts'
import { BloomFilter } from '../BloomFilter.ts'
import { BloomFilterLayout } from '../BloomFilterLayout.ts'

export class CheckMembershipAnimation extends HashAnimation<BloomFilter> {
  public static describe(size: number) {
    return HashAnimation.informationFor('bloom-filter', 'search-value', size)
  }

  constructor(model: BloomFilter, value = 99, storedValue = 99) {
    super(model, 'search-value', value, storedValue, new BloomFilterLayout())
  }
}
