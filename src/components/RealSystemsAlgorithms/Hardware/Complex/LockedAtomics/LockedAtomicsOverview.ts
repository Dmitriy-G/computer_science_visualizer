import type { SystemOverviewInformation } from '../../../../../visualization/SystemOverviewInformation.ts'
import { LockedAtomicsAnimation } from './LockedAtomicsAnimation.ts'

export class LockedAtomicsOverview {
  public static describe(): SystemOverviewInformation {
    const information = LockedAtomicsAnimation.describe()
    return {
      name: information.name,
      summary: 'x86 locked read-modify-write instructions that make a shared update indivisible to competing processors.',
      problem: 'Two processors can read the same old value and overwrite one another when an update is split into separate loads and stores. Locked operations preserve each atomic update.',
      steps: [
        'Start two cores updating the same aligned, write-back-cacheable counter.',
        'Obtain exclusive access for the first atomic update; the competing update cannot interleave inside it.',
        'Execute LOCK XADD to add the operand and return the old counter value.',
        'Allow the second core to perform its update using the newly stored value.',
        'Execute LOCK CMPXCHG with a mismatching expected value; leave memory unchanged and return the actual value in the accumulator.',
        'Retry the comparison with a matching value to install the replacement atomically.',
      ],
      realWorldUsage: information.realWorldUsage,
    }
  }
}
