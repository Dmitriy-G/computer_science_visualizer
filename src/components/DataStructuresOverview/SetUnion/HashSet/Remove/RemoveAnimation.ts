import { HashAnimation } from '../../../../../visualization/HashAnimation.ts'
import { HashSet } from '../HashSet.ts'
import { HashSetLayout } from '../HashSetLayout.ts'

export class RemoveAnimation extends HashAnimation<HashSet> {
  public static describe(size: number) {
    return HashAnimation.informationFor('hash-set', 'delete-value', size)
  }

  constructor(model: HashSet, value = 99, storedValue = 99) {
    super(model, 'delete-value', value, storedValue, new HashSetLayout())
  }
}
