import type { SystemOverviewInformation } from '../../../../../visualization/SystemOverviewInformation.ts'
import { SsdNandExample } from './SsdNandExample.ts'
import type { SsdPageOperation } from './SsdPageModel.ts'

export class SsdPageOverview {
  public static create(operation: SsdPageOperation): SystemOverviewInformation {
    const write = operation === 'write'
    const note = 'Uses one complete 2 KiB data page plus a 128-byte conceptual spare area from the planar floating-gate SLC example. This is the minimum normal full-page operation shown, not a universal SSD host minimum: host logical blocks and physical NAND pages differ, partial-page modes vary, and this example groups four aligned 512-byte sectors. Bit 0 of byte A4 is enlarged while all 2048 data bytes are actually stored/read. Write starts with an erased page; read starts with the same payload already stored. Each lesson is independent. ECC stages and spare layout are conceptual, without computed redundancy or injected errors. Program/verify analog behavior, vendor command bytes, timings, crash recovery, flush/durability guarantees, garbage collection, and wear policies are excluded. SRAM is volatile runtime storage. Modern SSDs commonly use 3D charge-trap TLC/QLC with different geometry; SLC bits per cell and floating-gate construction are separate choices.'
    return {
      name: write ? 'Write one page (2 KiB)' : 'Read one page (2 KiB)',
      summary: write ? 'Program one complete NAND data page, following its payload through controller buffers, ECC, NAND latches, and persistent cell charge.' : 'Read one complete NAND data page, following cell sensing through NAND latches, controller ECC, and the host response.',
      problem: write ? 'Nonvolatile updates must program erased space and finish successfully before the controller exposes the new mapping.' : 'Stored threshold states must be sensed and checked before their data can be returned to the host.',
      steps: [
        'Submit one aligned 2 KiB host request and resolve its logical range to a physical NAND page.',
        write ? 'Receive all payload bytes in controller buffers and pass them through conceptual ECC encoding.' : 'Issue a physical page READ through the selected channel, target, and NAND die.',
        write ? 'Issue page PROGRAM setup and load the complete page into NAND program latches.' : 'Select the wordline shared by cells across counted NAND strings and apply read references.',
        write ? 'Apply wordline and bitline biases to program zero positions while inhibiting one positions.' : 'Sense the page into volatile latches without intentionally changing persistent cell charge.',
        write ? 'Add electrons to selected floating gates; the enlarged first-byte bit becomes 0.' : 'Select output columns and return the sensed page through NAND I/O and the channel.',
        write ? 'Verify the programmed page and receive a successful NAND status.' : 'Pass returned bytes through separate conceptual controller ECC decoding before buffering them.',
        write ? 'Publish the runtime mapping after success, then return write completion.' : 'Return all checked page bytes to the host; preserve stored pages and mapping.',
        'Keep block erase separate: these examples never erase a block.',
      ],
      implementationNote: note,
      realWorldUsage: { technologies: [
        { name: 'SkyHigh S34ML02G2 page access', url: SsdNandExample.sourceUrl, usage: 'Documents data/spare page organization, page reads, page programs, and separate whole-block erases for the SLC example.' },
        { name: 'KIOXIA NAND charge storage and sensing', url: 'https://www.kioxia.com/en-jp/rd/technology/nand-flash.html', usage: 'Explains nonvolatile charge storage and threshold-dependent conduction during reads.' },
      ], products: [], note },
    }
  }
}
