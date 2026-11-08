import type { SystemOverviewInformation } from '../../../../../visualization/SystemOverviewInformation.ts'
import { MemoryFencesAnimation } from './MemoryFencesAnimation.ts'

export class MemoryFencesOverview {
  public static describe(): SystemOverviewInformation {
    const information = MemoryFencesAnimation.describe()
    return {
      name: information.name,
      summary: 'Explicit x86 ordering instructions that constrain different combinations of memory accesses and local execution.',
      problem: 'Concurrent code can observe stores or execute later work before the intended prerequisite is satisfied. The required fence depends on whether the code needs load/store, store-only, or local execution ordering.',
      steps: [
        'Start with the two-core store-buffering example and place MFENCE between each store and following load.',
        'Keep a core at MFENCE while its earlier store is still pending.',
        'Publish the stores, then allow the later loads; compare outcomes with no fence, SFENCE, and LFENCE.',
        'For a separate write-combining example, issue a payload store before publishing a ready flag.',
        'Use SFENCE to order the earlier payload store before the later flag store.',
        'For the LFENCE example, issue a load whose response is still pending.',
        'Keep later local execution waiting until the earlier load completes and LFENCE can finish.',
        'Select the fence for the required ordering; these instructions do not provide a general cache flush or persistence guarantee.',
      ],
      realWorldUsage: information.realWorldUsage,
    }
  }
}
