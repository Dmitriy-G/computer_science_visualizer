import type { SystemOverviewInformation } from '../../../../../visualization/SystemOverviewInformation.ts'
import { DmbAnimation } from './DmbAnimation.ts'

export class DmbOverview {
  public static describe(): SystemOverviewInformation {
    const information = DmbAnimation.describe()
    return {
      name: information.name,
      summary: 'An Arm memory barrier that orders selected memory accesses within a specified shareability domain.',
      problem: 'A reader can observe a ready flag before the associated data, or read the data too early. Correct publication requires ordering on both the producer and consumer sides within the relevant scope.',
      steps: [
        'Write the shared data on the producer core.',
        'Execute DMB ISHST to order earlier stores before the later ready-flag store in the Inner Shareable domain.',
        'Publish the ready flag after satisfying that ordering.',
        'Let a consumer in the same domain load the flag and confirm that it is set.',
        'Execute DMB ISHLD to order the flag load before the following data load.',
        'Load the published data; observers outside the selected domain are not covered by this barrier option.',
      ],
      realWorldUsage: information.realWorldUsage,
    }
  }
}
