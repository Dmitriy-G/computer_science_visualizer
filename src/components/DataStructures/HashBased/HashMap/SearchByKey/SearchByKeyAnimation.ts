import { HashAnimation } from '../../../../../visualization/HashAnimation.ts'
import { HashMap } from '../HashMap.ts'
import { HashMapLayout } from '../HashMapLayout.ts'

export class SearchByKeyAnimation extends HashAnimation<HashMap> {
  public static describe(size: number) {
    return HashAnimation.informationFor('hash-map', 'search-value', size)
  }

  constructor(model: HashMap, value = 99, storedValue = 99) {
    super(model, 'search-value', value, storedValue, new HashMapLayout())
  }
}
