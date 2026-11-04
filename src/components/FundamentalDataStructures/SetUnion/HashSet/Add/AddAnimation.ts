import { HashAnimation } from '../../../../../visualization/HashAnimation.ts'
import { HashSet } from '../HashSet.ts'
import { HashSetLayout } from '../HashSetLayout.ts'

export class AddAnimation extends HashAnimation<HashSet> {
  public static describe(size: number) {
    return HashAnimation.informationFor('hash-set', 'insert', size)
  }

  constructor(model: HashSet, value = 99, storedValue = 99) {
    super(model, 'insert', value, storedValue, new HashSetLayout())
  }
}
