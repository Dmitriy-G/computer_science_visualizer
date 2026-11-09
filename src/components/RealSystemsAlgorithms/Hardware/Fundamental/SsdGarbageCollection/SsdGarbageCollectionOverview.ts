import type { SystemOverviewInformation } from '../../../../../visualization/SystemOverviewInformation.ts'

export class SsdGarbageCollectionOverview {
  public static describe(): SystemOverviewInformation {
    return {
      name: 'SSD garbage collection: reclaiming invalid pages',
      summary: 'A flash controller preserves live pages and erases blocks containing obsolete copies to replenish erased space.',
      problem: 'Out-of-place writes leave invalid pages mixed with still-needed data, preventing immediate block reuse.',
      steps: [
        'Inspect blocks after three initial writes and two out-of-place updates.',
        'Choose the block with most invalid pages, breaking ties by block number in this example.',
        'Program each live page into erased space outside the victim.',
        'Publish each relocated logical mapping before invalidating its previous copy.',
        'Erase the victim only after all required live copies have moved.',
        'Return the erased block to reusable space and compare host writes with NAND page programs.',
      ],
      implementationNote: 'Illustrative victim selection and fixed page sizes. Five completed host writes plus one relocation produce six successful flash programs, giving WAF 6/5 in this workload; metadata writes are excluded. Filesystem deletion alone does not inform the device of invalid pages. Recovery, TRIM processing, and background timing are outside the model. Reclaiming space differs from balancing wear.',
      realWorldUsage: {
        technologies: [
          { name: 'KIOXIA managed-flash garbage collection', url: 'https://americas.kioxia.com/content/dam/kioxia/en-us/business/memory/mlc-nand/asset/KIOXIA_Managed_Flash_BOS_P4_Understanding_Garbage_Collection_Tech_Brief.pdf', usage: 'Describes relocation of valid data and block erasure to recover space.' },
          { name: 'Kingston SSD garbage collection', url: 'https://www.kingston.com/en/ssd/ssd-faq', usage: 'Confirms garbage collection and describes its relationship to TRIM and controller-managed NAND reuse.' },
        ],
        products: [], note: 'Illustrative victim selection and fixed page sizes. Five completed host writes plus one relocation produce six successful flash programs, giving WAF 6/5 in this workload; metadata writes are excluded. Filesystem deletion alone does not inform the device of invalid pages. Recovery, TRIM processing, and background timing are outside the model. Reclaiming space differs from balancing wear.',
      },
    }
  }
}
