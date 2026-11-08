import type { SystemOverviewInformation } from '../../../../../visualization/SystemOverviewInformation.ts'
import { AcquireReleaseAnimation } from './AcquireReleaseAnimation.ts'

export class AcquireReleaseOverview {
  public static describe(): SystemOverviewInformation {
    const information = AcquireReleaseAnimation.describe()
    return {
      name: information.name,
      summary: 'Arm load-acquire and store-release instructions that attach directional ordering to a synchronization access.',
      problem: 'A consumer must see the data associated with a ready flag, rather than reuse a read performed too early. Release and acquire connect publication to the consumer that observes it.',
      steps: [
        'Have the producer write the data that another core will consume.',
        'Publish the ready flag with STLR, ordering earlier accesses before the release.',
        'Have the consumer load the flag with LDAR.',
        'If the ready value is not observed, keep waiting rather than consume the data.',
        'When the acquire observes the releasing store, keep subsequent data accesses after that acquire.',
        'Load and use the published data; the synchronization access does not act as a general cache flush.',
      ],
      realWorldUsage: information.realWorldUsage,
    }
  }
}
