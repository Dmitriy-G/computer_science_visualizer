import type { HardwareElementInformation } from '../../../../../visualization/HardwareElementInformation.ts'

export class RamCircuitInformation {
  private static readonly moduleDocumentation = {
    title: 'Kingston / an 8 GiB DDR4 1Rx8 module example',
    url: 'https://www.kingston.com/datasheets/KF432C16BWA_8.pdf',
  }
  private static readonly accessDocumentation = {
    title: 'Wang et al. / DRAM organization, activation, sensing, and restoration',
    url: 'https://users.ece.cmu.edu/~saugatag/papers/18micro_cal.pdf',
  }
  private static readonly cellDocumentation = {
    title: 'Samsung / DRAM storage cells and refresh',
    url: 'https://semiconductor.samsung.com/dram/',
  }
  private static readonly dmaDocumentation = {
    title: 'Linux / DMA, host bridges, and memory address mappings',
    url: 'https://docs.kernel.org/core-api/dma-api-howto.html',
  }
  private static readonly scope = 'The diagram uses an illustrative 8 GiB DDR4 module: eight 8-Gbit x8 chips, one modeled die per chip, four bank groups per die, and four banks per group. This does not identify the separately photographed module.'
  private static readonly cellsPerBank = 8 * 2 ** 30 / 16

  private static readonly entries: Readonly<Record<string, HardwareElementInformation>> = {
    'ram-memory-controller': {
      photos: [],
      overview: 'The host memory controller translates system memory requests into operations on the DDR memory channel.',
      problem: 'It coordinates commands, addresses, data transfers, timing, and refresh scheduling for attached memory.',
      characteristicNote: 'This block is external CPU/SoC context. Its location and channel organization depend on the platform; it is not a component mounted on the DIMM.',
      characteristics: [
        { name: 'Requests', value: 'Receives memory work from the host fabric, including supported CPU and device DMA traffic.' },
        { name: 'DDR access', value: 'Sends command/address information and exchanges read/write data through the DIMM socket.' },
        { name: 'Coordination', value: 'Schedules accesses subject to device timing and maintenance requirements.' },
      ],
      documentation: [this.accessDocumentation, this.dmaDocumentation],
    },
    'ram-sideband-host': {
      photos: [],
      overview: 'The platform SPD sideband host reads configuration information from the module EEPROM.',
      problem: 'It lets platform firmware discover memory organization and supported settings before configuring normal memory access.',
      characteristicNote: 'This is an external platform function. The on-module SPD EEPROM is a separate diagram element.',
      characteristics: [
        { name: 'Configuration', value: 'Reads module information and supported timing data from SPD storage.' },
        { name: 'Connection', value: 'The DDR4 example uses an I2C-compatible sideband path through the socket.' },
        { name: 'Traffic', value: 'SPD communication is separate from DDR application-data transfers.' },
      ],
      documentation: [{
        title: 'Microchip / 34AA04 DDR4 SPD EEPROM and its serial interface',
        url: 'https://www.microchip.com/en-us/product/34AA04',
      }, this.moduleDocumentation],
    },
    'ram-pcie-root': {
      photos: [],
      overview: 'The CPU/SoC PCIe root complex connects PCIe devices to the host platform and its memory system.',
      problem: 'It provides the host-side path used when devices issue supported memory transactions, including DMA.',
      characteristicNote: 'This is external host-platform context. The DIMM itself attaches through DDR, while PCIe terminates in the host I/O system.',
      characteristics: [
        { name: 'Device requests', value: 'Routes supported PCIe transactions toward the host memory fabric and memory controller.' },
        { name: 'Addressing', value: 'Drivers prepare DMA mappings; host bridges and optional IOMMUs participate in translating device-visible addresses.' },
        { name: 'Abstraction', value: 'Address protection, translation details, and coherence mechanisms are outside this diagram.' },
      ],
      documentation: [this.dmaDocumentation, {
        title: 'Linux / PCI driver resources and device setup',
        url: 'https://docs.kernel.org/PCI/pci.html',
      }],
    },
    'ram-die': {
      photos: [],
      overview: 'A DRAM die contains memory-cell arrays and the circuitry that selects, senses, refreshes, and transfers their data.',
      problem: 'It integrates dense working storage with the peripheral logic needed to access that storage.',
      characteristicNote: this.scope,
      characteristics: [
        { name: 'Modeled capacity', value: '8 Gbit per die, with one monolithic die per chip in this example.' },
        { name: 'Organization', value: 'Four groups of four banks give sixteen banks per modeled die.' },
        { name: 'Packaging', value: 'The die is inside a package; the supplied package photographs show its exterior surfaces.' },
      ],
      documentation: [this.moduleDocumentation, this.accessDocumentation],
    },
    'ram-control': {
      photos: [],
      overview: 'DRAM control logic decodes received commands and address information.',
      problem: 'It coordinates the bank and row state required to read, write, and maintain stored data.',
      characteristicNote: 'This is on-chip memory control circuitry. The separate external memory controller schedules commands over the DDR channel.',
      characteristics: [
        { name: 'Activation', value: 'ACTIVATE selects a bank row for sensing and restoration.' },
        { name: 'Column access', value: 'READ and WRITE select data within an open row.' },
        { name: 'Maintenance', value: 'PRECHARGE closes a row; refresh operations preserve data as cell charge leaks.' },
      ],
      documentation: [this.accessDocumentation, this.moduleDocumentation],
    },
    'ram-refresh': {
      photos: [],
      overview: 'Refresh circuitry coordinates the periodic restoration of charge in DRAM rows.',
      problem: 'It prevents data loss caused by leakage from storage capacitors.',
      characteristicNote: 'Refresh scheduling and internal row sequencing are grouped here. The bit-access lessons show access restoration while scheduled refresh remains idle.',
      characteristics: [
        { name: 'Row selection', value: 'Internal sequencing selects the rows due for maintenance.' },
        { name: 'Restoration', value: 'Bank-local sense amplifiers recover the stored values and restore cell charge.' },
        { name: 'Interface', value: 'Refresh maintains data without returning a normal read payload to the host.' },
      ],
      documentation: [this.cellDocumentation, this.accessDocumentation],
    },
    'ram-read-write': {
      photos: [],
      overview: 'DRAM read/write circuitry exchanges selected memory data with the external DDR interface.',
      problem: 'It connects internal bank data paths to the timed payload transfers used by the memory channel.',
      characteristicNote: 'The lesson magnifies one selected bit within a wider memory transfer. Actual DDR transactions use supported bursts and multiple data signals.',
      characteristics: [
        { name: 'Read', value: 'Drives selected row-buffer data toward the module and memory controller.' },
        { name: 'Write', value: 'Receives data and forwards it to selected bank columns for storage.' },
        { name: 'Timing', value: 'DDR data strobes coordinate payload timing; commands and addresses follow their separate control path.' },
      ],
      documentation: [this.moduleDocumentation, this.accessDocumentation],
    },
    'ram-bank-group-0': {
      photos: [],
      overview: 'A DDR4 bank group collects several banks within a DRAM device.',
      problem: 'Bank groups organize access resources and define timing relationships between operations targeting different banks.',
      characteristicNote: this.scope,
      characteristics: [
        { name: 'Groups', value: 'Four per modeled x8 die; one representative group is expanded.' },
        { name: 'Banks', value: 'Four banks in each group, giving sixteen per die.' },
        { name: 'Variation', value: 'Bank-group organization and applicable timing depend on device width and memory generation.' },
      ],
      documentation: [this.moduleDocumentation],
    },
    'ram-bank': {
      photos: [],
      overview: 'A DRAM bank groups storage arrays with row selection, column access, and local sense amplifiers.',
      problem: 'It partitions storage into units that retain their own access state and can be scheduled under device timing constraints.',
      characteristicNote: this.scope,
      characteristics: [
        { name: 'Count', value: 'Sixteen banks per modeled die; 128 chip-local banks across the eight-chip module.' },
        { name: 'Storage', value: `${this.cellsPerBank.toLocaleString('en-US')} addressable one-bit data cells per bank, excluding spare cells.` },
        { name: 'Rank access', value: 'Corresponding banks in rank chips operate together to supply the rank data width.' },
      ],
      documentation: [this.moduleDocumentation, this.accessDocumentation],
    },
    'ram-row-decoder': {
      photos: [],
      overview: 'The row decoder converts row-selection information into a selected wordline.',
      problem: 'It enables the chosen row of cell access transistors so stored data can be sensed and restored.',
      characteristicNote: 'A representative row-selection function is shown. Physical decoder organization and quantities depend on the die design.',
      characteristics: [
        { name: 'Address', value: 'Uses the row selected by an access command or internal refresh sequence.' },
        { name: 'Wordline', value: 'Controls the access-transistor gates in the selected row.' },
        { name: 'Preparation', value: 'Opening the row prepares its data for later column operations.' },
      ],
      documentation: [this.accessDocumentation],
    },
    'ram-array': {
      photos: [],
      overview: 'DRAM cell arrays arrange storage cells into rows and columns within a bank.',
      problem: 'They share selection and data paths across a dense collection of stored bits.',
      characteristicNote: 'The block groups multiple physical subarrays. Their number is unspecified; the displayed cell quantity is the bank total across all its subarrays.',
      characteristics: [
        { name: 'Wordlines', value: 'Select rows by controlling access-transistor gates.' },
        { name: 'Bitlines', value: 'Carry small cell signals to sense amplifiers and carry driven values back during restoration or writes.' },
        { name: 'Peripheral circuits', value: 'Decoders, sense amplifiers, and I/O support the arrays around their storage cells.' },
      ],
      documentation: [this.accessDocumentation, this.cellDocumentation],
    },
    'ram-cells': {
      photos: [],
      overview: 'Each conventional 1T1C DRAM data cell combines one access transistor and one storage capacitor to hold a bit.',
      problem: 'It provides dense volatile storage that can be selected, sensed, restored, and updated.',
      characteristicNote: 'One representative cell is enlarged. Displayed charge levels and the 0/1 charge mapping are symbolic; physical spare cells are excluded from the example counts.',
      characteristics: [
        { name: 'Per-bank count', value: `${this.cellsPerBank.toLocaleString('en-US')} addressable data cells, derived from 8 Gbit divided by sixteen banks.` },
        { name: 'Module count', value: '68,719,476,736 data bits in the illustrative 8 GiB module.' },
        { name: 'Retention', value: 'Stored capacitor charge requires power and periodic refresh to preserve its information.' },
      ],
      documentation: [this.cellDocumentation, this.accessDocumentation],
    },
    'ram-transistor': {
      photos: [],
      overview: 'The cell access transistor switches the connection between the storage capacitor and its bitline.',
      problem: 'It permits access to a selected cell while isolating its storage node when the row is closed.',
      characteristicNote: 'One access transistor per modeled data cell gives 536,870,912 per bank. Decoder, sense-amplifier, control, and other peripheral transistors are additional.',
      characteristics: [
        { name: 'Gate', value: 'Driven by the selected row wordline.' },
        { name: 'Conducting', value: 'Connects the capacitor and bitline for charge sharing, restoration, or writing.' },
        { name: 'Isolated', value: 'Disconnects the storage node after access; charge leakage still requires refresh.' },
      ],
      documentation: [this.cellDocumentation, this.accessDocumentation],
    },
    'ram-capacitor': {
      photos: [],
      overview: 'The storage capacitor holds the charge that represents a DRAM cell data bit.',
      problem: 'It provides a compact storage node that can be sensed and rewritten through the access transistor.',
      characteristicNote: 'This is an internal memory-cell capacitor. Its displayed charge bar is symbolic, rather than an actual voltage or capacitance measurement.',
      characteristics: [
        { name: 'Count', value: 'One per modeled data cell; 536,870,912 per bank, excluding spare cells.' },
        { name: 'Access', value: 'Exchanges charge with a bitline when its access transistor is enabled.' },
        { name: 'Maintenance', value: 'Sense amplifiers restore charge after activation; periodic refresh preserves data over time.' },
      ],
      documentation: [this.cellDocumentation, this.accessDocumentation],
    },
    'ram-sense-amplifiers': {
      photos: [],
      overview: 'Sense amplifiers detect and amplify the small bitline signal from an activated DRAM row.',
      problem: 'They recover stable bit values, hold the open row, and restore the charge of its connected cells.',
      characteristicNote: 'The row buffer consists of local sensing/latching circuitry. Its latches are separate from the transistor-capacitor storage cells.',
      characteristics: [
        { name: 'Activation', value: 'Cells share charge with their bitlines before sensing.' },
        { name: 'Restoration', value: 'Amplified values are driven back into the cells while the wordline stays active.' },
        { name: 'Open row', value: 'Column operations read or update selected row-buffer entries before precharge closes the row.' },
      ],
      documentation: [this.accessDocumentation],
    },
    'ram-column-decoder': {
      photos: [],
      overview: 'Column-selection circuitry chooses data from an activated bank row.',
      problem: 'It routes the requested part of the row buffer between local sensing circuitry and chip I/O.',
      characteristicNote: 'Column decoding and data selection are grouped here. The lesson follows one bit within the wider burst transfer supported by a real DDR device.',
      characteristics: [
        { name: 'Read', value: 'Selects open-row data for delivery through the read/write circuitry.' },
        { name: 'Write', value: 'Directs incoming data to the selected columns for updating their stored values.' },
        { name: 'Row hits', value: 'More column operations can use the same open row before a precharge is required.' },
      ],
      documentation: [this.accessDocumentation, this.moduleDocumentation],
    },
  }

  public static get(regionId: string | null): HardwareElementInformation | null {
    if (regionId === null) return null
    return this.entries[regionId] ?? null
  }
}
