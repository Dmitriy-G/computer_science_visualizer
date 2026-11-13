import { HardwareDiagram } from '../../../../../visualization/HardwareDiagram.ts'
import type { Scene, SceneRegion } from '../../../../../visualization/Scene.ts'

export class RamLayout {
  public static readonly width = 2700
  public static readonly height = 1400
  public static readonly componentCount = 7
  private static readonly example = {
    moduleGiB: 8,
    chipsPerModule: 8,
    diesPerChip: 1,
    bankGroupsPerDie: 4,
    banksPerGroup: 4,
  } as const
  private static readonly banksPerDie = this.example.bankGroupsPerDie * this.example.banksPerGroup
  private static readonly cellsPerBank = this.example.moduleGiB * 2 ** 30 * 8 / (this.example.chipsPerModule * this.example.diesPerChip * this.banksPerDie)
  private static readonly bankCellCount = `~${Math.round(this.cellsPerBank / 1_000_000)}M`

  public static create(): Scene {
    const diagram = this.diagram()
    return {
      kind: 'system-overview', width: diagram.width, height: diagram.height,
      nodes: [], edges: [], regions: diagram.regions, paths: diagram.paths,
      count: this.componentCount, countLabel: 'DRAM functional groups', focusId: null,
    }
  }

  public static diagram(): HardwareDiagram {
    const diagram = new HardwareDiagram(this.width, this.height)
    this.addInterfaces(diagram)
    this.addChip(diagram)
    this.addBank(diagram)
    this.addCellWiring(diagram)
    this.connect(diagram)
    this.applyColors(diagram)
    return diagram
  }

  private static applyColors(diagram: HardwareDiagram): void {
    const greenRegions = new Set([
      'ram-chip',
      'ram-cells',
      'ram-control',
      'ram-refresh',
      'ram-read-write',
      'ram-bank-group-0',
    ])
    const lightBlueRegions = new Set([
      'ram-socket',
      'ram-spd',
      'ram-row-decoder',
      'ram-array',
      'ram-sense-amplifiers',
      'ram-column-decoder',
    ])
    for (let index = 0; index < diagram.regions.length; index += 1) {
      const region = diagram.regions[index]
      let color: SceneRegion['color'] = 'neutral'
      if (greenRegions.has(region.id)) color = 'green'
      else if (lightBlueRegions.has(region.id)) color = 'light-blue'
      else if (region.id === 'ram-die' || region.id === 'ram-bank') color = 'lavender'
      diagram.regions[index] = { ...region, color }
    }
  }

  private static addInterfaces(diagram: HardwareDiagram): void {
    diagram.region('ram-memory-controller', 'External CPU/SoC memory controller / sends commands and addresses, manages timing and refresh scheduling, and exchanges read/write data through the socket', 'device', 40, 180, 320, 300, 'component', undefined, 'Memory controller')
      .region('ram-sideband-host', 'Platform SPD sideband host / accesses module configuration independently of normal memory payloads', 'observer', 40, 1080, 320, 200, 'component', undefined, 'SPD sideband host')
      .region('ram-socket', 'DIMM socket / external communication interface between the motherboard and RAM module; carries command/address, bidirectional memory data, and separate SPD sideband traffic', 'interconnect', 420, 120, 260, 1200, 'component', undefined, 'DIMM socket')
      .region('ram-pcb', 'DDR4 RAM example / 8 GiB, single rank, non-ECC, eight 8-Gbit x8 chips, modeled as one monolithic die per chip. Counts describe this configuration, not all RAM. One representative instance of each component is drawn; placement remains logical', 'device', 740, 20, 1920, 1360, 'system', undefined, `DDR4 RAM (${this.example.moduleGiB} GiB, 1 rank)`)
      .region('ram-spd', 'SPD / separate on-module DDR4 configuration EEPROM, outside the DRAM chips; stores module organization and supported timings and is accessed through the platform sideband interface', 'observer', 780, 1080, 240, 200, 'component', 'ram-pcb', 'SPD')
  }

  private static addChip(diagram: HardwareDiagram): void {
    diagram.region('ram-chip', 'DRAM chips / eight x8 chips form the 64-bit rank in this 8 GiB DDR4 example. Each chip holds 8 Gbit, or 1 GiB. One of the eight chips is expanded; counts vary with rank count, capacity, ECC, and chip width', 'memory', 1080, 120, 1520, 1220, 'component', 'ram-pcb', `Chips (~${this.example.chipsPerModule} per RAM board)`)
      .region('ram-die', 'DRAM dies / this example uses one monolithic 8-Gbit die per chip, or eight dies per module. Stacked packages can contain more dies; the illustrated internal layout is logical rather than an exact die floorplan', 'memory', 1100, 180, 1480, 1140, 'component', 'ram-chip', `DRAM dies (~${this.example.diesPerChip} per chip)`)
      .region('ram-control', 'Control logic / decodes commands and latches addresses; ACTIVATE opens a selected row, READ/WRITE accesses columns, and PRECHARGE closes the row after the required timing', 'device', 1120, 220, 300, 240, 'component', 'ram-die', 'Control logic')
      .region('ram-refresh', 'Refresh circuitry / selects rows using internal counting and sequencing, restoring charge through bank-local sense amplifiers without host data transfer', 'device', 1120, 580, 300, 220, 'component', 'ram-die', 'Refresh circuitry')
      .region('ram-read-write', 'Read/write circuitry / input/output buffers exchange selected-column data with the module interface; DDR data strobes provide transfer timing', 'interconnect', 1120, 980, 300, 240, 'component', 'ram-die', 'Read/write circuitry')
  }

  private static addBank(diagram: HardwareDiagram): void {
    diagram.region('ram-bank-group-0', 'Bank groups / four per x8 DDR4 die in this example, or 32 across the eight-chip module. One group is expanded; group counts differ for other device widths and generations', 'memory', 1500, 220, 1060, 1080, 'component', 'ram-die', `Bank groups (~${this.example.bankGroupsPerDie} per die)`)
      .region('ram-bank', 'Banks / four per bank group, sixteen per die, and 128 chip-local banks across the eight-chip module. Each bank owns its cell array and active-row buffer. Corresponding banks in rank chips operate together to supply the rank data width', 'memory', 1540, 300, 980, 960, 'component', 'ram-bank-group-0', `Banks (~${this.example.banksPerGroup} per bank group)`)
      .region('ram-row-decoder', 'Row decoder / selects a wordline from the requested row address or internal refresh row selection', 'device', 1580, 420, 250, 360, 'component', 'ram-bank', 'Row decoder')
      .region('ram-array', 'Cell arrays (subarrays) / this single diagram block groups the multiple physical subarrays in a bank. Their number depends on the chip design and is not specified by the module capacity alone. The memory-cell count below is the bank total across all subarrays, not the count of one subarray; redundant spare cells are omitted', 'memory', 1900, 420, 600, 360, 'component', 'ram-bank', 'Cell arrays (subarrays)')
      .region('ram-cells', `Memory cells / ${this.cellsPerBank.toLocaleString('en-US')} addressable one-bit data cells per bank, derived from 8 Gbit per die divided by sixteen banks. The module holds 68,719,476,736 data bits. Physical spare cells are not counted`, 'memory', 1940, 500, 520, 240, 'component', 'ram-array', `Memory cells (${this.bankCellCount} per bank)`)
      .region('ram-transistor', 'Access transistors / one per data cell: 536,870,912 per bank and 68,719,476,736 across this module. Peripheral control, decoder, and I/O transistors and spare cells are additional and excluded from this count', 'device', 1960, 570, 220, 140, 'component', 'ram-cells', 'Transistors (~1 per cell)')
      .region('ram-capacitor', 'Storage capacitors / one per data cell: 536,870,912 per bank and 68,719,476,736 across this module. This count excludes spare cells and discrete board-level power capacitors', 'memory', 2220, 570, 220, 140, 'component', 'ram-cells', 'Capacitors (~1 per cell)')
      .region('ram-sense-amplifiers', 'Sense amplifiers / bank-local row buffer, sensing the active row and restoring cell charge while the wordline remains enabled; refresh uses the same local path', 'cache', 1900, 900, 600, 130, 'component', 'ram-bank', 'Sense amplifiers / row buffer')
      .region('ram-column-decoder', 'Column decoder / selects columns in the open row buffer for reads and writes; row hits can repeat before precharge closes that row', 'device', 1900, 1130, 600, 90, 'component', 'ram-bank', 'Column decoder')
  }

  private static addCellWiring(diagram: HardwareDiagram): void {
    diagram.paths.push(
      { id: 'ram-word-line-0', d: 'M1830 530H1920V560H2070V570', label: 'Wordline / row decoder to access-transistor gates inside the cell array', highlighted: false, strokeWidth: 1.5 },
      { id: 'ram-bit-line-0', d: 'M1960 660H1948V850H2070V900', label: 'Bitline / access transistors to bank-local sense amplifiers for sensing and restoration', highlighted: false, strokeWidth: 1.5, caption: { text: 'Bitline', x: 2120, y: 860 } },
      { id: 'ram-storage-node', d: 'M2180 660H2220', label: 'Storage node / a transistor connects its paired capacitor to the column bitline when the row is selected', highlighted: false, strokeWidth: 2 },
    )
  }

  private static connect(diagram: HardwareDiagram): void {
    const paths: readonly [string, string, string, boolean][] = [
      ['ram-controller-command', 'M360 300H420', 'Commands and addresses / external memory controller to DIMM socket', false],
      ['ram-controller-data', 'M420 750H390V430H360', 'Bidirectional data / memory controller writes to RAM and receives read data through the socket', true],
      ['ram-socket-control', 'M680 340H1120', 'Commands and addresses / module interface to the representative chip control logic', false],
      ['ram-control-row', 'M1420 340H1460V600H1580', 'Bank and row selection / control logic to row decoder', false],
      ['ram-control-column', 'M1420 400H1460V1240H2200V1220', 'Column selection / control logic to column decoder', false],
      ['ram-control-refresh', 'M1270 460V580', 'Refresh coordination / control logic to refresh sequencing', false],
      ['ram-refresh-row', 'M1420 690H1480V720H1580', 'Refresh row selection / wordline and bitline paths lead to the bank-local sense amplifiers that restore charge', false],
      ['ram-sense-column', 'M2200 1030V1130', 'Selected-column data / bank row buffer and column access', true],
      ['ram-column-io', 'M1900 1175H1460V1100H1420', 'Data / selected columns and chip I/O buffers', true],
      ['ram-io-socket', 'M1120 1100H1040V750H680', 'Bidirectional memory data / chip I/O buffers and module socket interface', true],
      ['ram-host-sideband', 'M360 1180H420', 'Separate SPD sideband / platform configuration host to socket', true],
      ['ram-spd-sideband', 'M680 1180H780', 'Module sideband / socket to the separate SPD EEPROM, outside the DRAM chips', true],
    ]
    for (const [id, d, label, bidirectional] of paths) diagram.paths.push({ id, d, label, highlighted: false, directed: true, bidirectional, strokeWidth: 2 })
  }
}
