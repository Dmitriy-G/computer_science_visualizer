import type { SystemOverviewInformation } from '../../../../../visualization/SystemOverviewInformation.ts'

export class SsdFtlOverview {
  public static describe(): SystemOverviewInformation {
    return {
      name: 'SSD FTL: logical-to-physical mapping and out-of-place updates',
      summary: 'A Flash Translation Layer maps logical pages to flash locations and redirects updates to erased space.',
      problem: 'Repeated logical writes must work while NAND cannot arbitrarily overwrite already-programmed pages.',
      steps: [
        'Look up a logical address in a small L2P table.',
        'Read its currently mapped physical page.',
        'Allocate a different erased page for the update.',
        'Program replacement data while retaining the previous mapping.',
        'After successful programming, publish the new mapping and invalidate the previous copy.',
        'Look up the same logical address and read the replacement.',
        'Inject a failed program into another page; quarantine that page and retain the successful mapping.',
      ],
      implementationNote: 'Simple page-mapped teaching policy with one logical page per illustrated host write. Failed pages are quarantined. Mapping granularity, metadata writes, journaling, and recovery vary; normal completion does not promise safety against power loss. The KIOXIA technical brief covers managed e-MMC/UFS translation rather than this exact SSD policy.',
      realWorldUsage: {
        technologies: [
          { name: 'KIOXIA logical-to-physical address translation', url: 'https://americas.kioxia.com/content/dam/kioxia/en-us/business/memory/mlc-nand/asset/KIOXIA_Managed_Flash_BOS_P5_Understanding_L2P_Block_Address_Translation_Tech_Brief.pdf', usage: 'Explains logical/physical mapping tables and updates in managed NAND.' },
        ],
        products: [], note: 'Simple page-mapped teaching policy with one logical page per illustrated host write. Failed pages are quarantined. Mapping granularity, metadata writes, journaling, and recovery vary; normal completion does not promise safety against power loss. The KIOXIA technical brief covers managed e-MMC/UFS translation rather than this exact SSD policy.',
      },
    }
  }
}
