import { CpuOperationOverview } from '../CpuOperationOverview.ts'

export class AtomicLoadOverview {
  public static describe() { return CpuOperationOverview.create('load') }
}
