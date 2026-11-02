import { HashAnimation } from '../../../../../visualization/HashAnimation.ts'
import { HashMap } from '../HashMap.ts'
import { HashMapLayout } from '../HashMapLayout.ts'

export class DeleteByKeyAnimation extends HashAnimation<HashMap> {
  public static describe(size: number) {
    return HashAnimation.informationFor('hash-map', 'delete-value', size)
  }

  constructor(model: HashMap, value = 99, storedValue = 99) {
    super(model, 'delete-value', value, storedValue, new HashMapLayout())
  }
}
