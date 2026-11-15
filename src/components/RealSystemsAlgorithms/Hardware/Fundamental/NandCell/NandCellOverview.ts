import type { SystemOverviewInformation } from '../../../../../visualization/SystemOverviewInformation.ts'
import { SsdNandExample } from '../Ssd/SsdNandExample.ts'

export class NandCellOverview {
  public static describe(): SystemOverviewInformation {
    const implementationNote = 'Illustrative SLC with one PROGRAM per erased page. Erased cells read 1; programmed zero cells have higher threshold. Real devices impose program-order and partial-program limits. TLC/QLC and charge-trap versus floating-gate designs differ. ECC is identified but not computed. A page cannot be erased independently. Static map counts use S34ML02G2 x8 geometry: two planes per die, 1,024 blocks per plane, 64 pages per block, and 2 KiB data plus 128 spare bytes per page. Two channels, two packages per channel, and one die per package are modeling choices (1 GiB raw data capacity). The lower playback panel uses much smaller symbolic pages and blocks. Pages group cells across parallel strings; each string connects cells in series. Insulated cell charge persists without power; sense-amplifier/page-buffer latches hold data temporarily.'
    return {
      name: 'NAND: charge storage, page access, and block erase',
      summary: 'Stored charge shifts a NAND cell threshold; page access and whole-block erase expose that physical storage to a controller.',
      problem: 'Nonvolatile cells must support useful updates despite erase-before-reuse constraints.',
      steps: [
        'Inspect an erased SLC cell, its charge-storage region, and low threshold.',
        'Place cells in conceptual pages belonging to one erase block.',
        'Load the page buffer, identify controller ECC encoding, then program selected cells to higher-threshold states.',
        'Read a page by reference-voltage sensing of cell conduction.',
        'Pass decoded data to a separate controller ECC stage.',
        'Reject an arbitrary overwrite of a programmed page, preserving its contents.',
        'Erase the entire block, including its other pages.',
        'Program replacement data into erased space.',
      ],
      implementationNote,
      realWorldUsage: {
        technologies: [
          { name: 'KIOXIA NAND cell charge and threshold sensing', url: 'https://www.kioxia.com/en-jp/rd/technology/nand-flash.html', usage: 'Explains stored electrons, threshold shift, read-reference conduction, and nonvolatile retention.' },
          { name: 'SkyHigh S34ML02G2 SLC array organization', url: SsdNandExample.sourceUrl, usage: 'Documents the x8 page data/spare sizes, pages per erase block, blocks per plane, two-plane organization, and page-buffer circuitry used for the static map example.' },
          { name: 'Kingston managed-flash page and block operations', url: 'https://www.kingston.com/en/blog/embedded-and-industrial/emmc-lifecycle', usage: 'Explains page programming and the requirement to erase a containing block before reuse.' },
        ],
        products: [], note: implementationNote,
      },
    }
  }
}
