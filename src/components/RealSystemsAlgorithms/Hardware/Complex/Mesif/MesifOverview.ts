import type { SystemOverviewInformation } from '../../../../../visualization/SystemOverviewInformation.ts'
import { MesifAnimation } from './MesifAnimation.ts'

export class MesifOverview {
  public static describe(): SystemOverviewInformation {
    const information = MesifAnimation.describe()
    return {
      name: information.name,
      implementationNote: 'MESIF extends MESI with a Forward state. The verified implementation listed here is Intel Xeon 7500-series QuickPath. Protocol choice belongs to the cache/interconnect design; an absent architecture tag does not mean every processor implements MESIF.',
      summary: 'A cache-coherence protocol that adds a clean Forward state to Modified, Exclusive, Shared, and Invalid.',
      problem: 'Multiple clean shared copies could all respond to the same read. A designated forwarder supplies the line while coherence still requires exclusive ownership for writes.',
      steps: [
        'Give the first reader the only clean copy in Exclusive state.',
        'When a second reader arrives, designate one clean copy as Forward and the other as Shared.',
        'Let the Forward holder supply another reader while other sharers remain silent.',
        'If the forwarder is evicted, choose a replacement using the policy illustrated by this example.',
        'When a sharer writes, invalidate the peer copies and move the writer to Modified.',
        'For a later read of that dirty line, this example writes back the data before creating clean Forward and Shared copies.',
      ],
      realWorldUsage: information.realWorldUsage,
    }
  }
}
