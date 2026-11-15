import { ComponentInformation } from '../../ComponentLesson.ts'
import { HddAccessAnimation } from '../HddAccessAnimation.ts'
import { ReadOneSectorOverview } from './ReadOneSectorOverview.ts'

export class ReadOneSectorAnimation extends HddAccessAnimation {
  constructor() { super('read') }
  public static describe() { return ComponentInformation.describe(ReadOneSectorOverview.describe()) }
}
