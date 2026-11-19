import type { HardwareElementInformation } from '../../../../../visualization/HardwareElementInformation.ts'
import { SsdNandExample } from './SsdNandExample.ts'

export class SsdNandInformation {
  public static readonly arrayDocumentation = {
    title: 'SkyHigh Memory / S34ML02G2 SLC NAND: array organization, commands, and block diagram',
    url: SsdNandExample.sourceUrl,
  }

  private static readonly cellDocumentation = {
    title: 'KIOXIA / NAND flash structure, stored charge, and read operation',
    url: 'https://www.kioxia.com/en-jp/rd/technology/nand-flash.html',
  }

  private static readonly flashDocumentation = {
    title: 'Kingston / Flash Memory Guide: cell types and flash management',
    url: 'https://media.kingston.com/pdfs/MKF-283.3-Flash-Memory-Guide_EN.pdf',
  }

  private static readonly geometryNote = 'Counts use the S34ML02G2 x8 SLC organization. The two-channel SSD topology is a teaching choice, not a typical modern SSD specification. One representative of each repeated element is expanded.'
  private static readonly cellNote = 'This enlargement illustrates a planar floating-gate SLC cell. Modern 3D NAND often uses charge-trap storage and TLC/QLC. SLC means one bit per cell, independently of its physical construction.'

  private static readonly entries: Readonly<Record<string, HardwareElementInformation>> = {
    'ssd-nand': {
      photos: [{
        src: '/hardware/ssd/nand.jpg',
        alt: 'User-supplied NAND package photograph showing a marked package top beside the underside solder-ball contacts of another package.',
        caption: 'NAND flash packages / supplied photograph of package top and underside',
        width: 4587,
        height: 3440,
      }],
      overview: 'NAND flash is the nonvolatile semiconductor memory holding the drive data between power cycles.',
      problem: 'It provides dense persistent storage that the controller accesses through page operations and block erasure.',
      characteristicNote: `${this.geometryNote} The supplied package photograph is a separate illustration; it does not establish the modeled SLC cell construction, capacity, or die count.`,
      characteristics: [
        { name: 'Modeled capacity', value: `${SsdNandExample.rawCapacityGiB} GiB of raw data across two channels, two packages per channel, and one die per package; spare bytes and controller reserves are separate.` },
        { name: 'Access units', value: 'Reads and programs address pages; erasure resets an entire erase block.' },
        { name: 'Cell example', value: 'The expanded SLC cell stores one bit in two threshold ranges; TLC and QLC store three and four bits using more ranges.' },
      ],
      documentation: [this.arrayDocumentation, this.cellDocumentation, this.flashDocumentation],
    },
    'ssd-nand-channel': {
      photos: [],
      overview: 'A NAND channel is the command, address, and data bus connecting a controller interface to selected flash targets.',
      problem: 'It transports physical NAND operations and page payloads between the controller and flash packages.',
      characteristicNote: this.geometryNote,
      characteristics: [
        { name: 'Model count', value: `${SsdNandExample.channelsPerSsd} channels per SSD, each serving ${SsdNandExample.packagesPerChannel} packages in the modeled topology.` },
        { name: 'Sharing', value: 'A shared bus carries one transfer at a time; target selection determines which device responds.' },
        { name: 'Parallel work', value: 'Independent channels and internal operations on different dies can overlap, subject to device restrictions.' },
      ],
      documentation: [this.arrayDocumentation],
    },
    'ssd-package-0': {
      photos: [],
      overview: 'A NAND package is the physical component containing flash silicon and the contacts used to connect it to the board.',
      problem: 'It protects the dies and provides a usable electrical and mechanical assembly.',
      characteristicNote: 'This example assigns one die per package. Real packages can stack multiple dies, so a package count alone does not establish capacity.',
      characteristics: [
        { name: 'Model count', value: `${SsdNandExample.packagesPerChannel} packages per channel and ${SsdNandExample.diesPerPackage} die per package.` },
        { name: 'Connections', value: 'Package contacts carry NAND commands, addresses, data, status, and power.' },
        { name: 'Hierarchy', value: 'The package contains the die; it is not another copy of the die storage.' },
      ],
      documentation: [this.arrayDocumentation],
    },
    'ssd-die-0': {
      photos: [],
      overview: 'A NAND die is a piece of silicon containing the cell array and peripheral circuits needed to access it.',
      problem: 'It combines persistent cells with decoding, sensing, voltage generation, and an external NAND interface.',
      characteristicNote: this.geometryNote,
      characteristics: [
        { name: 'Capacity example', value: 'The selected S34ML02G2 organization holds 2 Gbit, or 256 MiB, of data per die, excluding spare storage.' },
        { name: 'Planes', value: `${SsdNandExample.planesPerDie} planes per modeled die.` },
        { name: 'Local circuits', value: 'Command logic, row and column selection, page buffers, and program/erase voltage circuitry surround the array logically.' },
      ],
      documentation: [this.arrayDocumentation],
    },
    'ssd-nand-control': {
      photos: [],
      overview: 'The NAND die command, address, and status logic interprets bus requests and sequences internal flash operations.',
      problem: 'It turns physical read, program, and erase requests into coordinated activity inside the selected die.',
      characteristicNote: 'This is on-die logic, distinct from SSD firmware and the controller-side NAND interface. Exact circuit partitioning varies.',
      characteristics: [
        { name: 'Inputs', value: 'Receives command and address information through NAND I/O.' },
        { name: 'Sequencing', value: 'Coordinates row selection and read/program/erase control.' },
        { name: 'Status', value: 'Reports operation readiness and success or failure according to the device interface.' },
      ],
      documentation: [this.arrayDocumentation],
    },
    'ssd-nand-voltage': {
      photos: [],
      overview: 'Voltage generation and program/erase control produce the electrical biases used to access NAND cells.',
      problem: 'Reading, programming, and erasing require different voltages and controlled sequences that ordinary data I/O cannot provide.',
      characteristicNote: 'Voltages, pulse counts, and analog verification are abstracted in this diagram. NAND has no periodic DRAM-style refresh requirement, though retention and disturb still require management.',
      characteristics: [
        { name: 'Read', value: 'Provides the reference and pass biases needed to sense the selected cells.' },
        { name: 'Program', value: 'Applies program pulses and verification to reach target threshold ranges.' },
        { name: 'Erase', value: 'Uses block-level erase biases to reset the containing block.' },
      ],
      documentation: [this.arrayDocumentation, this.cellDocumentation],
    },
    'ssd-nand-io': {
      photos: [],
      overview: 'Column selection and NAND data I/O connect selected bytes of the die page buffer to the external NAND bus.',
      problem: 'They move page payloads and interface information between the die and SSD controller.',
      characteristicNote: 'NAND I/O is not the host PCIe or SATA interface. Commands, addresses, and data share device bus pins at different stages.',
      characteristics: [
        { name: 'Programming', value: 'Loads incoming data into volatile page-buffer latches before array programming.' },
        { name: 'Reading', value: 'Outputs selected bytes from the sensed page buffer.' },
        { name: 'Column address', value: 'Selects positions within the page and spare area, according to the device command.' },
      ],
      documentation: [this.arrayDocumentation],
    },
    'ssd-plane-0': {
      photos: [],
      overview: 'A plane is a subdivision of a NAND die containing erase blocks and associated access circuitry.',
      problem: 'It organizes a large memory array and supports the access organization defined by the NAND device.',
      characteristicNote: 'Supported multiplane operations have device-specific address and sequencing restrictions. Plane counts do not establish exact peripheral circuit counts.',
      characteristics: [
        { name: 'Model count', value: `${SsdNandExample.planesPerDie} planes per die, with ${SsdNandExample.blocksPerPlane.toLocaleString('en-US')} erase blocks per plane.` },
        { name: 'Contents', value: 'Contains persistent cell blocks plus decoding, sensing, and page-buffer functions.' },
        { name: 'Capacity', value: 'The modeled plane contributes 128 MiB of data, excluding spare storage.' },
      ],
      documentation: [this.arrayDocumentation],
    },
    'ssd-block-0': {
      photos: [],
      overview: 'An erase block is a group of NAND pages that are reset together by a block-erase operation.',
      problem: 'It defines the reuse boundary for cells that cannot be freely overwritten or individually erased.',
      characteristicNote: this.geometryNote,
      characteristics: [
        { name: 'Page count', value: `${SsdNandExample.pagesPerBlock} pages per block in this SLC example.` },
        { name: 'Data capacity', value: '128 KiB of data plus 8 KiB of spare storage per modeled block.' },
        { name: 'Preservation', value: 'Still-valid pages must be preserved elsewhere before erasing their block.' },
      ],
      documentation: [this.arrayDocumentation, this.flashDocumentation],
    },
    'ssd-nand-string': {
      photos: [],
      overview: 'A NAND string connects memory-cell transistors in series so a selected cell can be accessed through the shared current path.',
      problem: 'Series organization provides a dense array while wordlines select the cell position to read or program.',
      characteristicNote: 'Strings and pages are crossing views of the same cell array. Counts omit spare-column strings and select transistors.',
      characteristics: [
        { name: 'Model organization', value: `${SsdNandExample.dataCellsPerPage.toLocaleString('en-US')} data strings per block, with ${SsdNandExample.pagesPerBlock} SLC data cells per string in the simplified view.` },
        { name: 'Read access', value: 'Other cells receive pass biases so the selected cell can determine the sensed string current.' },
        { name: 'Page relation', value: 'One selected wordline spans many strings; its cells together form the modeled SLC page.' },
      ],
      documentation: [this.cellDocumentation, this.arrayDocumentation],
    },
    'ssd-page-0': {
      photos: [],
      overview: 'A page is the group of cells accessed together for NAND reading or programming.',
      problem: 'It provides the data access unit within a block while erasure remains a whole-block operation.',
      characteristicNote: 'The page box is a view of cells on one selected wordline across the counted strings, not a separate storage array. TLC/QLC page organization differs.',
      characteristics: [
        { name: 'Size example', value: `${SsdNandExample.dataBytesPerPage} data bytes plus ${SsdNandExample.spareBytesPerPage} spare bytes per SLC page.` },
        { name: 'Block relation', value: `${SsdNandExample.pagesPerBlock} pages share one erase block.` },
        { name: 'Write restrictions', value: 'Programming requires suitable page state and device-specific ordering; a page cannot be independently erased.' },
      ],
      documentation: [this.arrayDocumentation],
    },
    'ssd-page-data': {
      photos: [],
      overview: 'The page data area is the NAND cell storage allocated to the page payload.',
      problem: 'It holds the bytes later retrieved through sensing, NAND I/O, and controller error correction.',
      characteristicNote: 'These are the same cells represented by the strings and wordline view. The byte count is specific to the modeled SLC device.',
      characteristics: [
        { name: 'Size', value: `${SsdNandExample.dataBytesPerPage} bytes, or ${SsdNandExample.dataCellsPerPage.toLocaleString('en-US')} one-bit data cells, per page.` },
        { name: 'Host relation', value: 'The lessons transfer one aligned 2 KiB range consisting of four 512-byte logical sectors.' },
        { name: 'Overhead', value: 'Spare storage is counted separately from these payload bytes.' },
      ],
      documentation: [this.arrayDocumentation],
    },
    'ssd-page-spare': {
      photos: [],
      overview: 'The spare area is additional NAND storage accompanying the page data.',
      problem: 'It provides space used for error-control redundancy, bad-block information, and metadata according to the device and controller layout.',
      characteristicNote: 'Spare bytes are persistent NAND cells, not a volatile buffer. They are distinct from whole spare blocks reserved by the SSD.',
      characteristics: [
        { name: 'Size example', value: `${SsdNandExample.spareBytesPerPage} spare bytes per modeled page, in addition to ${SsdNandExample.dataBytesPerPage} data bytes.` },
        { name: 'Reserved fields', value: 'Bad-block markers and ECC requirements restrict how this space may be used.' },
        { name: 'Lesson scope', value: 'The diagram identifies spare/ECC roles without computing a production spare-byte layout.' },
      ],
      documentation: [this.arrayDocumentation],
    },
    'ssd-nand-row-decoder': {
      photos: [],
      overview: 'The row decoder selects the addressed block and wordline for NAND access.',
      problem: 'It directs read and program biases to the intended cell row and participates in block selection for erasure.',
      characteristicNote: 'The map shows one logical row-decoder block. Physical decoder counts and layouts are implementation dependent.',
      characteristics: [
        { name: 'Selection', value: 'Uses the physical row address supplied by NAND command logic.' },
        { name: 'Wordlines', value: 'Drives control gates of cells at the selected position across parallel strings.' },
        { name: 'Biases', value: 'Selected and unselected wordlines receive different biases during access.' },
      ],
      documentation: [this.arrayDocumentation, this.cellDocumentation],
    },
    'ssd-nand-page-buffer': {
      photos: [],
      overview: 'Sense amplifiers detect string-current states, while page-buffer latches temporarily hold data during NAND operations.',
      problem: 'They convert cell behavior into data and retain the bitline information needed for programming and verification.',
      characteristicNote: 'These are volatile peripheral circuits, separate from persistent NAND cells and the controller DMA buffers. The box groups functions without claiming a physical instance count.',
      characteristics: [
        { name: 'Reading', value: 'Senses the selected page before its bytes leave through NAND I/O.' },
        { name: 'Programming', value: 'Holds incoming data and drives or inhibits bitlines for selected cells.' },
        { name: 'Error correction', value: 'Controller ECC decoding/correction follows NAND readback in this map.' },
      ],
      documentation: [this.arrayDocumentation, this.cellDocumentation],
    },
    'ssd-nand-cell': {
      photos: [],
      overview: 'The enlarged SLC cell is one memory transistor whose stored charge changes the voltage needed for conduction.',
      problem: 'It stores one persistent bit that can be read by comparing the transistor behavior against a reference.',
      characteristicNote: this.cellNote,
      characteristics: [
        { name: 'One bit', value: 'Two threshold ranges represent erased 1 and programmed 0 in this example.' },
        { name: 'Storage', value: 'Electrons are retained in an insulated floating gate after power removal.' },
        { name: 'Construction', value: 'Control gate, floating gate, insulators, and source-drain channel are parts of the same transistor; there is no separate DRAM-style storage capacitor.' },
      ],
      documentation: [this.cellDocumentation, this.flashDocumentation],
    },
    'ssd-nand-gate': {
      photos: [],
      overview: 'The control gate is the driven electrode connected to the wordline for the selected memory-cell position.',
      problem: 'It applies the electric field used to read the cell or control program operations.',
      characteristicNote: this.cellNote,
      characteristics: [
        { name: 'Read reference', value: 'The applied voltage lets the sensed current distinguish threshold states.' },
        { name: 'Pass bias', value: 'Unselected cells in the series string are biased to allow the selected cell to be sensed.' },
        { name: 'Coupling', value: 'Influences the floating gate electrostatically through insulation; it is not the persistent charge store.' },
      ],
      documentation: [this.cellDocumentation],
    },
    'ssd-nand-gate-insulator': {
      photos: [],
      overview: 'The gate insulator separates the control gate from the floating-gate charge-storage region.',
      problem: 'It permits electrostatic coupling while isolating the stored charge from a normal conductive connection to the wordline.',
      characteristicNote: 'This is an insulating layer within the planar cell, not a separate circuit or stored bit. Layer materials and construction vary by NAND technology.',
      characteristics: [
        { name: 'Electrical role', value: 'The control-gate field influences the cell through the insulator.' },
        { name: 'Diagram relation', value: 'The dashed coupling line is a symbolic electrical relationship, not a data wire.' },
      ],
      documentation: [this.cellDocumentation],
    },
    'ssd-nand-charge': {
      photos: [],
      overview: 'The floating gate is the insulated conductive region retaining electrons in this planar NAND example.',
      problem: 'Retained charge shifts the cell threshold so a stored bit remains distinguishable without continuous power.',
      characteristicNote: this.cellNote,
      characteristics: [
        { name: 'Erased state', value: 'Lower stored charge gives a lower threshold and reads as 1 in the shown SLC convention.' },
        { name: 'Programmed state', value: 'Added electrons raise the threshold and the cell reads as 0.' },
        { name: 'Interpretation', value: 'The bit is a classification of an analog threshold range, not a literal single electron.' },
      ],
      documentation: [this.cellDocumentation],
    },
    'ssd-nand-tunnel-oxide': {
      photos: [],
      overview: 'The tunnel oxide is the thin insulating barrier between the floating gate and the silicon side of the cell.',
      problem: 'It retains charge under normal conditions while allowing controlled electron tunneling under strong program or erase fields.',
      characteristicNote: 'The illustration separates ordinary sensing from intentional charge movement. It does not model oxide thickness, voltages, or lifetime numerically.',
      characteristics: [
        { name: 'Program/erase', value: 'Strong electric fields allow electrons to move through the barrier.' },
        { name: 'Read', value: 'Senses conduction without intentionally adding or removing stored charge.' },
        { name: 'Reliability', value: 'Retention loss, disturb, and program/erase wear limit real flash behavior.' },
      ],
      documentation: [this.cellDocumentation, this.flashDocumentation],
    },
    'ssd-nand-conduction': {
      photos: [],
      overview: 'The source-drain channel is the current path through the same memory transistor whose threshold is set by stored charge.',
      problem: 'Its conduction at a chosen read voltage allows the sense circuitry to distinguish the stored state.',
      characteristicNote: 'This is part of the memory transistor, not an additional access transistor. The diagram uses the erased-1/programmed-0 SLC convention.',
      characteristics: [
        { name: 'Erased cell', value: 'The lower-threshold cell conducts at the illustrated read reference and is interpreted as 1.' },
        { name: 'Programmed cell', value: 'The higher-threshold cell remains off at that reference and is interpreted as 0.' },
        { name: 'String access', value: 'Other series cells use pass biases so the selected cell controls the sensed string current.' },
      ],
      documentation: [this.cellDocumentation],
    },
    'ssd-nand-source-terminal': {
      photos: [],
      overview: 'The source line supplies the return connection for current through the selected NAND string.',
      problem: 'It completes the electrical sensing path through the series cells and their select circuitry.',
      characteristicNote: 'The map groups the remaining string and source-select circuitry into this named terminal. It is not an extra storage cell or another page copy.',
      characteristics: [
        { name: 'Read path', value: 'Current through the selected string can be observed from its bitline side with a source return.' },
        { name: 'Shared structure', value: 'The enlarged cell belongs to the same series string represented by the array view.' },
      ],
      documentation: [this.cellDocumentation, this.arrayDocumentation],
    },
  }

  public static get(regionId: string): HardwareElementInformation | null {
    return this.entries[regionId] ?? null
  }
}
