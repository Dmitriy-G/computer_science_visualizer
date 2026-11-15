import { ComponentInformation } from '../../ComponentLesson.ts'
import { SsdPageAnimation } from '../SsdPageAnimation.ts'
import { WriteOnePageOverview } from './WriteOnePageOverview.ts'

export class WriteOnePageAnimation extends SsdPageAnimation {
  constructor() { super('write') }
  public static describe() { return ComponentInformation.describe(WriteOnePageOverview.describe()) }
}
