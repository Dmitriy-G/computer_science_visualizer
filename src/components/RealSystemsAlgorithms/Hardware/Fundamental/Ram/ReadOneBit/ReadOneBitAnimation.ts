import { ComponentInformation } from '../../ComponentLesson.ts'
import { RamBitAnimation } from '../RamBitAnimation.ts'
import { ReadOneBitOverview } from './ReadOneBitOverview.ts'

export class ReadOneBitAnimation extends RamBitAnimation {
  public readonly title = ReadOneBitOverview.describe().name
  protected readonly operation = 'read' as const
  public static describe() { return ComponentInformation.describe(ReadOneBitOverview.describe()) }
}
