import { ComponentInformation } from '../../ComponentLesson.ts'
import { SsdPageAnimation } from '../SsdPageAnimation.ts'
import { ReadOnePageOverview } from './ReadOnePageOverview.ts'

export class ReadOnePageAnimation extends SsdPageAnimation {
  constructor() { super('read') }
  public static describe() { return ComponentInformation.describe(ReadOnePageOverview.describe()) }
}
