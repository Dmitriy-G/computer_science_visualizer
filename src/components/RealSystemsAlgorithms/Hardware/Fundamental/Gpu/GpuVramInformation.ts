import type { HardwareElementInformation } from '../../../../../visualization/HardwareElementInformation.ts'
import { GpuVramExample } from './GpuVramExample.ts'

export class GpuVramInformation {
  private static readonly memoryDocumentation = {
    title: 'Micron / GDDR6 graphics DRAM',
    url: 'https://www.micron.com/products/memory/graphics-memory/gddr6',
  }
  private static readonly cellDocumentation = {
    title: 'Samsung / DRAM transistor-capacitor storage and refresh',
    url: 'https://semiconductor.samsung.com/dram/',
  }
  private static readonly accessDocumentation = {
    title: 'Wang et al. / DRAM organization, activation, sensing, and restoration',
    url: 'https://users.ece.cmu.edu/~saugatag/papers/18micro_cal.pdf',
  }
  private static readonly scope = 'This is a logical enlargement of graphics DRAM. Physical placement, circuit counts, signaling, and timing depend on the memory device.'
  private static readonly example = `Counts refer to the diagram's ${GpuVramExample.capacityGiB} GiB GDDR6 example: ${GpuVramExample.chipsPerVram} chips, ${GpuVramExample.chipDensityGib} Gbit per chip, and ${GpuVramExample.diesPerChip} modeled die per chip. They do not identify the separate photographed package.`

  private static readonly entries: Readonly<Record<string, HardwareElementInformation>> = {
    'gpu-vram-die': {
      photos: [],
      overview: 'A graphics DRAM die contains memory-cell banks and the circuits that control, refresh, and transfer their data.',
      problem: 'It integrates dense volatile storage and the peripheral circuitry needed to access it.',
      characteristicNote: this.example,
      characteristics: [
        { name: 'Modeled packaging', value: `${GpuVramExample.diesPerChip} monolithic die per chip; other package organizations can differ.` },
        { name: 'Bank organization', value: `${GpuVramExample.banksPerDie} banks per modeled die, grouped into ${GpuVramExample.channelsPerDie} channels with ${GpuVramExample.banksPerChannel} banks each.` },
        { name: 'Functions', value: 'Command logic, refresh, data I/O, bank decoders, and sense amplifiers surround the cell arrays.' },
      ],
      documentation: [this.memoryDocumentation, this.accessDocumentation],
    },
    'gpu-vram-control': {
      photos: [],
      overview: 'Command and address logic interprets memory-controller requests and selects the required graphics DRAM operations.',
      problem: 'It directs accesses to the correct bank, row, and column while coordinating memory state changes.',
      characteristicNote: this.scope,
      characteristics: [
        { name: 'Selection', value: 'Uses the received command and address information to target memory resources.' },
        { name: 'Operations', value: 'Coordinates row activation, column reads or writes, precharge, and refresh handling.' },
        { name: 'Separate paths', value: 'Command/address traffic controls access; payload data passes through data I/O.' },
      ],
      documentation: [this.memoryDocumentation, this.accessDocumentation],
    },
    'gpu-vram-refresh': {
      photos: [],
      overview: 'Refresh circuitry coordinates periodic restoration of graphics DRAM cell charge.',
      problem: 'It preserves stored data as charge leaks from the memory capacitors.',
      characteristicNote: 'The diagram shows the refresh function. Access-related restoration uses the same bank-local sensing path, while scheduled refresh stays idle in the current GPU lessons.',
      characteristics: [
        { name: 'Restoration', value: 'Selected rows are sensed and their cell charge is restored.' },
        { name: 'Scheduling', value: 'Memory-controller commands and device circuitry coordinate the required refresh operations.' },
        { name: 'Payload', value: 'Refresh maintains stored bits without delivering a normal read payload to the GPU.' },
      ],
      documentation: [this.cellDocumentation, this.accessDocumentation],
    },
    'gpu-vram-io': {
      photos: [],
      overview: 'Graphics-memory data I/O and prefetch buffers connect selected internal data to the external memory interface.',
      problem: 'They bridge internal memory access and the high-speed transfers exchanged with the GPU memory controller.',
      characteristicNote: 'The schematic groups I/O and prefetch functions. Actual burst sizes, prefetch organization, and signaling depend on the memory generation and device.',
      characteristics: [
        { name: 'Read', value: 'Transfers selected row-buffer data toward the GPU memory controller.' },
        { name: 'Write', value: 'Receives payload data and forwards it toward the selected bank columns.' },
        { name: 'Buffering', value: 'Groups internal transfers into the data movement required by the supported external interface.' },
      ],
      documentation: [this.memoryDocumentation],
    },
    'gpu-vram-bank': {
      photos: [],
      overview: 'A graphics DRAM bank groups cell arrays with row selection, column access, and local sensing circuitry.',
      problem: 'Banks organize storage so memory operations can target one portion of a device while other banks retain their own state.',
      characteristicNote: this.example,
      characteristics: [
        { name: 'Bank count', value: `${GpuVramExample.banksPerDie} per modeled die; ${GpuVramExample.chipsPerVram * GpuVramExample.banksPerDie} chip-local banks across the example VRAM.` },
        { name: 'Data cells', value: `${GpuVramExample.cellsPerBank.toLocaleString('en-US')} addressable one-bit cells per bank, excluding spare cells.` },
        { name: 'Open row', value: 'Activation senses a selected row into local sense amplifiers; column operations use that open row before precharge.' },
      ],
      documentation: [this.memoryDocumentation, this.accessDocumentation],
    },
    'gpu-vram-row-decoder': {
      photos: [],
      overview: 'The row decoder selects a wordline in the addressed bank.',
      problem: 'It connects the chosen row of storage cells to their bitlines for sensing and restoration.',
      characteristicNote: this.scope,
      characteristics: [
        { name: 'Input', value: 'Receives row-selection information from command or refresh circuitry.' },
        { name: 'Wordline', value: 'The selected wordline controls access-transistor gates along the row.' },
        { name: 'Access', value: 'Row activation prepares the bank for subsequent column reads or writes.' },
      ],
      documentation: [this.accessDocumentation],
    },
    'gpu-vram-array': {
      photos: [],
      overview: 'Cell arrays arrange graphics DRAM storage cells in rows and columns within a bank.',
      problem: 'They organize a large number of stored bits for shared row and column access.',
      characteristicNote: 'This block groups multiple physical subarrays. The number of subarrays is unspecified; the cell count shown below it is the bank total.',
      characteristics: [
        { name: 'Rows', value: 'Wordlines select groups of cell access transistors.' },
        { name: 'Columns', value: 'Bitlines connect selected cells to sensing and write circuitry.' },
        { name: 'Enlargement', value: 'One representative transistor-capacitor pair is expanded to explain storage.' },
      ],
      documentation: [this.accessDocumentation, this.cellDocumentation],
    },
    'gpu-vram-cell': {
      photos: [],
      overview: 'A conventional 1T1C DRAM storage cell pairs one access transistor with one storage capacitor to hold one bit.',
      problem: 'It provides compact working storage that can be read, restored, and overwritten.',
      characteristicNote: 'The enlargement represents one cell. Charge levels and their displayed 0/1 mapping are symbolic; spare cells and peripheral circuitry are excluded from the example counts.',
      characteristics: [
        { name: 'Cell count', value: `${GpuVramExample.cellsPerBank.toLocaleString('en-US')} addressable data cells per modeled bank.` },
        { name: 'Selection', value: 'The wordline enables the transistor so the capacitor can exchange charge with a bitline.' },
        { name: 'Retention', value: 'Stored charge requires power and periodic refresh to preserve its information.' },
      ],
      documentation: [this.cellDocumentation, this.accessDocumentation],
    },
    'gpu-vram-transistor': {
      photos: [],
      overview: 'The access transistor switches the connection between a cell capacitor and its bitline.',
      problem: 'It allows a selected cell to be accessed while isolating the storage node when its row is closed.',
      characteristicNote: 'One access transistor belongs to each modeled 1T1C data cell. This count excludes the additional transistors in decoders, sense amplifiers, and other peripheral circuits.',
      characteristics: [
        { name: 'Gate control', value: 'The row wordline controls whether the transistor conducts.' },
        { name: 'Enabled', value: 'Connects the storage node to the bitline for charge sharing, restoration, or writing.' },
        { name: 'Disabled', value: 'Isolates the capacitor after row access; its charge still leaks over time.' },
      ],
      documentation: [this.cellDocumentation, this.accessDocumentation],
    },
    'gpu-vram-capacitor': {
      photos: [],
      overview: 'The storage capacitor holds the charge used to represent a DRAM data bit.',
      problem: 'It provides the small, dense storage node of a transistor-capacitor memory cell.',
      characteristicNote: 'This is an internal cell capacitor. The lesson charge bar is symbolic and does not specify an actual voltage or capacitance.',
      characteristics: [
        { name: 'Quantity', value: 'One storage capacitor per modeled data cell.' },
        { name: 'Read and write', value: 'The access transistor connects it to the bitline for sensing, restoration, and charge updates.' },
        { name: 'Leakage', value: 'Charge loss over time makes periodic refresh necessary.' },
      ],
      documentation: [this.cellDocumentation, this.accessDocumentation],
    },
    'gpu-vram-sense': {
      photos: [],
      overview: 'Sense amplifiers detect and amplify the small bitline changes produced when a DRAM row opens.',
      problem: 'They turn weak capacitor signals into stable row-buffer values and restore charge to the connected cells.',
      characteristicNote: 'The row buffer consists of sensing/latching circuitry, distinct from the 1T1C storage cells. Its geometry in this diagram is illustrative.',
      characteristics: [
        { name: 'Sensing', value: 'Amplifies the bitline signal after the selected cells share charge.' },
        { name: 'Restoration', value: 'Drives the sensed values back into cells while the wordline remains enabled.' },
        { name: 'Column access', value: 'The open row supplies selected data for reads and accepts write updates before precharge.' },
      ],
      documentation: [this.accessDocumentation],
    },
    'gpu-vram-column-decoder': {
      photos: [],
      overview: 'Column-selection circuitry chooses data within an activated bank row.',
      problem: 'It routes the requested portion of the open row between the sense amplifiers and graphics-memory I/O.',
      characteristicNote: 'The diagram groups column decoding and data selection. Actual transfer widths and burst organization depend on the device.',
      characteristics: [
        { name: 'Read', value: 'Selects row-buffer data for transfer through the I/O path.' },
        { name: 'Write', value: 'Routes incoming payload data to the selected row-buffer columns and connected cells.' },
        { name: 'Row reuse', value: 'Multiple column accesses can use an open row before it is closed with precharge.' },
      ],
      documentation: [this.memoryDocumentation, this.accessDocumentation],
    },
  }

  public static get(regionId: string | null): HardwareElementInformation | null {
    if (regionId === null) return null
    return this.entries[regionId] ?? null
  }
}
