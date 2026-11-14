import { ComponentInformation } from '../../ComponentLesson.ts'
import { CpuOperationAnimation } from '../CpuOperationAnimation.ts'
import { AtomicLoadOverview } from './AtomicLoadOverview.ts'

export class AtomicLoadAnimation extends CpuOperationAnimation {
  public readonly title = AtomicLoadOverview.describe().name
  protected readonly operation = 'load' as const
  public static describe() { return ComponentInformation.describe(AtomicLoadOverview.describe()) }
}
