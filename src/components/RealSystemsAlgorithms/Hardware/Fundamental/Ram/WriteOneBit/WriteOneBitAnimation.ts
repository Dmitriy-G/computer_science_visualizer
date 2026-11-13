import { ComponentInformation } from '../../ComponentLesson.ts'
import { RamBitAnimation } from '../RamBitAnimation.ts'
import { WriteOneBitOverview } from './WriteOneBitOverview.ts'

export class WriteOneBitAnimation extends RamBitAnimation {
  public readonly title = WriteOneBitOverview.describe().name
  protected readonly operation = 'write' as const
  public static describe() { return ComponentInformation.describe(WriteOneBitOverview.describe()) }
}
