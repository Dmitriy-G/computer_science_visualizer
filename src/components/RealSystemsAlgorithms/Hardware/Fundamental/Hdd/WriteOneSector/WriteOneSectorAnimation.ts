import { ComponentInformation } from '../../ComponentLesson.ts'
import { HddAccessAnimation } from '../HddAccessAnimation.ts'
import { WriteOneSectorOverview } from './WriteOneSectorOverview.ts'

export class WriteOneSectorAnimation extends HddAccessAnimation {
  constructor() { super('write') }
  public static describe() { return ComponentInformation.describe(WriteOneSectorOverview.describe()) }
}
