import type { SystemOverviewInformation } from '../../../../../visualization/SystemOverviewInformation.ts'
import { TranslationAnimation } from './TranslationAnimation.ts'

export class TranslationOverview {
  public static describe(): SystemOverviewInformation {
    const information = TranslationAnimation.describe()
    return {
      name: information.name,
      summary: 'A hardware address-translation path that checks a TLB and walks memory-resident page tables when a cached mapping is missing.',
      problem: 'Walking page tables for every memory access repeats expensive work. The TLB caches mappings, while translation maintenance prevents an old cached mapping from surviving a remap.',
      steps: [
        'Split the virtual address into page-table indices and an unchanged page offset.',
        'Look up the virtual page and address-space identifier in the TLB.',
        'On a miss, follow the root table and successive descriptors; this example combines four table levels into one walk stage.',
        'Use the final descriptor to form the physical address and cache the translation in the TLB.',
        'Repeat the access and use the TLB hit without another table walk.',
        'For the remap example, quiesce accesses, invalidate the old page-table entry, and publish it with DSB ISHST.',
        'Issue the scoped TLBI, wait for completion with DSB ISH, and synchronize the local context with ISB.',
        'Install the replacement valid descriptor and publish it before resuming accesses in this example.',
        'Walk again on the next TLB miss and cache the replacement mapping.',
      ],
      realWorldUsage: information.realWorldUsage,
    }
  }
}
