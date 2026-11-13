import type { SystemOverviewInformation } from '../../../../../visualization/SystemOverviewInformation.ts'

export class NandCellOverview {
  public static describe(): SystemOverviewInformation {
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
      implementationNote: 'Illustrative SLC with one PROGRAM per erased page. Erased cells read 1; programmed zero cells have higher threshold. Real devices impose program-order and partial-program limits. TLC/QLC and charge-trap versus floating-gate designs differ. ECC is identified but not computed. A page cannot be erased independently.',
      realWorldUsage: {
        technologies: [
          { name: 'KIOXIA NAND cell charge and threshold sensing', url: 'https://www.kioxia.com/en-jp/rd/technology/nand-flash.html', usage: 'Explains stored electrons, threshold shift, read-reference conduction, and nonvolatile retention.' },
          { name: 'Kingston managed-flash page and block operations', url: 'https://www.kingston.com/en/blog/embedded-and-industrial/emmc-lifecycle', usage: 'Explains page programming and the requirement to erase a containing block before reuse.' },
        ],
        products: [], note: 'Illustrative SLC with one PROGRAM per erased page. Erased cells read 1; programmed zero cells have higher threshold. Real devices impose program-order and partial-program limits. TLC/QLC and charge-trap versus floating-gate designs differ. ECC is identified but not computed. A page cannot be erased independently.',
      },
    }
  }
}
