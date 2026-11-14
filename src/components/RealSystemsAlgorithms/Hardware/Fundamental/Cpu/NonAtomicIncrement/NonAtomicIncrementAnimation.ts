import { ComponentInformation } from '../../ComponentLesson.ts'
import { CpuOperationAnimation } from '../CpuOperationAnimation.ts'
import { NonAtomicIncrementOverview } from './NonAtomicIncrementOverview.ts'

export class NonAtomicIncrementAnimation extends CpuOperationAnimation {
  public readonly title = NonAtomicIncrementOverview.describe().name
  protected readonly operation = 'increment' as const
  public static describe() { return ComponentInformation.describe(NonAtomicIncrementOverview.describe()) }
}
