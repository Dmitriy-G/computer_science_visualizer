import { HashAnimation } from '../../../../../visualization/HashAnimation.ts'
import { BloomFilter } from '../BloomFilter.ts'
import { BloomFilterLayout } from '../BloomFilterLayout.ts'

export class AddAnimation extends HashAnimation<BloomFilter> {
  public static describe(size: number) {
    return HashAnimation.informationFor('bloom-filter', 'insert', size)
  }

  constructor(model: BloomFilter, value = 99, storedValue = 99) {
    super(model, 'insert', value, storedValue, new BloomFilterLayout())
  }
}
