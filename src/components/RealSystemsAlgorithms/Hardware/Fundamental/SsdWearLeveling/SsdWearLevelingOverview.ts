import type { SystemOverviewInformation } from '../../../../../visualization/SystemOverviewInformation.ts'

export class SsdWearLevelingOverview {
  public static describe(): SystemOverviewInformation {
    return {
      name: 'SSD wear leveling: balancing block erases',
      summary: 'Controller allocation and relocation spread erase use among usable flash blocks, including blocks occupied by cold data.',
      problem: 'Repeated hot updates can wear a small set of blocks while lightly used blocks remain occupied by rarely changed data.',
      steps: [
        'Track block erase counts independently of current page validity.',
        'Compare the same six erase cycles concentrated on one block versus lowest-count allocation among free blocks.',
        'Dynamically choose the lowest-wear free block for a new host write.',
        'Identify cold data occupying a lightly worn block that dynamic allocation cannot use.',
        'Relocate cold data into a higher-wear erased block and publish its mapping.',
        'Erase the old cold-data block to make it available for future hot writes.',
        'Compare erase-count spread and relocation cost; select the newly freed low-wear block.',
      ],
      implementationNote: 'Initial counts, policy thresholds, and tie-breaking are illustrative. The six-cycle comparison is a separate counter scenario, not hidden erases of occupied media. Static relocation costs additional flash programs and need not immediately equalize counts. No fixed lifetime gain or proprietary SSD firmware behavior is claimed. Managed-flash evidence explains the general mechanism; Kingston confirms its SSD use.',
      realWorldUsage: {
        technologies: [
          { name: 'KIOXIA static and dynamic wear leveling', url: 'https://americas.kioxia.com/content/dam/kioxia/en-us/business/memory/mlc-nand/asset/KIOXIA_Managed_Flash_BOS_P3_Understanding_Wear_Leveling_Tech_Brief.pdf', usage: 'Distinguishes selecting low-count free blocks from relocating existing data to spread future wear.' },
          { name: 'Kingston SSD controller wear leveling', url: 'https://www.kingston.com/en/ssd/ssd-faq', usage: 'Confirms SSD controllers distribute flash use to avoid overusing a small set of cells.' },
        ],
        products: [], note: 'Initial counts, policy thresholds, and tie-breaking are illustrative. The six-cycle comparison is a separate counter scenario, not hidden erases of occupied media. Static relocation costs additional flash programs and need not immediately equalize counts. No fixed lifetime gain or proprietary SSD firmware behavior is claimed. Managed-flash evidence explains the general mechanism; Kingston confirms its SSD use.',
      },
    }
  }
}
