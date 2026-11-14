import { CpuOperationOverview } from '../CpuOperationOverview.ts'

export class NonAtomicIncrementOverview {
  public static describe() { return CpuOperationOverview.create('increment') }
}
