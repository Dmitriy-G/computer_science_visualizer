import { HashAnimation } from '../../../../../visualization/HashAnimation.ts'
import { HashSet } from '../HashSet.ts'
import { HashSetLayout } from '../HashSetLayout.ts'

export class ClearAnimation extends HashAnimation<HashSet> {
  public static describe(size: number) {
    return HashAnimation.informationFor('hash-set', 'clear', size)
  }

  constructor(model: HashSet, value = 99, storedValue = 99) {
    super(model, 'clear', value, storedValue, new HashSetLayout())
  }
}
