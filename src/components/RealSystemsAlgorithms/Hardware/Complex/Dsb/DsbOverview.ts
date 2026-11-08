import type { SystemOverviewInformation } from '../../../../../visualization/SystemOverviewInformation.ts'
import { DsbAnimation } from './DsbAnimation.ts'

export class DsbOverview {
  public static describe(): SystemOverviewInformation {
    const information = DsbAnimation.describe()
    return {
      name: information.name,
      summary: 'An Arm synchronization barrier that waits for relevant earlier operations to complete before following execution continues.',
      problem: 'Ordering accesses alone is insufficient when the next instruction depends on completed maintenance. DSB prevents execution from continuing while the required maintenance is still pending.',
      steps: [
        'Begin with a dirty data-cache line whose new value has not reached the Point of Unification.',
        'Issue DC CVAU to request a clean of that line to the Point of Unification.',
        'Reach DSB ISH and hold the following instruction while the relevant clean is pending.',
        'Transfer the updated data from the cache to the Point of Unification, which may itself be a cache.',
        'Return the maintenance-completion response to the waiting CPU.',
        'Complete DSB and allow the following instruction to execute; compare this with the earlier DMB run.',
      ],
      realWorldUsage: information.realWorldUsage,
    }
  }
}
