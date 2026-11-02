import { HashAnimation } from '../../../../../visualization/HashAnimation.ts'
import { HashSet } from '../HashSet.ts'
import { HashSetLayout } from '../HashSetLayout.ts'

export class ContainsAnimation extends HashAnimation<HashSet> {
  public static describe(size: number) {
    return HashAnimation.informationFor('hash-set', 'search-value', size)
  }

  constructor(model: HashSet, value = 99, storedValue = 99) {
    super(model, 'search-value', value, storedValue, new HashSetLayout())
  }
}
