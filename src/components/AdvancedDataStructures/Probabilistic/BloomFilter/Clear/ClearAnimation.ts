import { HashAnimation } from '../../../../../visualization/HashAnimation.ts'
import { BloomFilter } from '../BloomFilter.ts'
import { BloomFilterLayout } from '../BloomFilterLayout.ts'

export class ClearAnimation extends HashAnimation<BloomFilter> {
  public static describe(size: number) {
    return HashAnimation.informationFor('bloom-filter', 'clear', size)
  }

  constructor(model: BloomFilter, value = 99, storedValue = 99) {
    super(model, 'clear', value, storedValue, new BloomFilterLayout())
  }
}
