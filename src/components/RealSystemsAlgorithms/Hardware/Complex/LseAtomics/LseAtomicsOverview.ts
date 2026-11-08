import type { SystemOverviewInformation } from '../../../../../visualization/SystemOverviewInformation.ts'
import { LseAtomicsAnimation } from './LseAtomicsAnimation.ts'

export class LseAtomicsOverview {
  public static describe(): SystemOverviewInformation {
    const information = LseAtomicsAnimation.describe()
    return {
      name: information.name,
      summary: 'Arm FEAT_LSE instructions that perform architectural atomic updates such as add, compare-and-swap, and exchange.',
      problem: 'Shared updates must remain indivisible under contention. LSE expresses supported updates without an explicit software loop around an exclusive-store status result.',
      steps: [
        'Use a processor that supports FEAT_LSE and select the operation and ordering variant needed.',
        'In this example, issue LDADDAL to atomically add to the counter and return its old value.',
        'Let competing atomic increments observe successive counter values so both updates are preserved.',
        'Try CASAL with an expected value that does not match; receive the actual old value without replacing memory.',
        'Try CASAL with a matching expected value to install the replacement atomically.',
        'Use SWPAL to exchange a value and return the old one; the AL suffix supplies acquire/release ordering in these examples.',
      ],
      realWorldUsage: information.realWorldUsage,
    }
  }
}
