import type { HardwareElementInformation } from '../../../../../visualization/HardwareElementInformation.ts'
import { ServerConnectorInformation } from '../../../SystemOverview/ServerConnectorInformation.ts'
import { MotherboardIllustrations } from './MotherboardIllustrations.ts'

export class MotherboardInformation {
  private static readonly socketSources: Readonly<Record<string, string>> = {
    'bus-cpu-port': 'cpu-socket',
    'bus-ram-port': 'dimm-sockets',
    'bus-gpu-port': 'gpu-slot',
    'bus-network-adapter-port': 'nic-slot',
    'bus-ssd-port': 'nvme-connector',
    'bus-hdd-port': 'sata-ports',
    'bus-usb-port': 'host-usb-ports',
  }

  private static readonly boardDocumentation = {
    title: 'Supermicro / X12DPG-U6 motherboard manual: physical platform components and connections',
    url: 'https://www.supermicro.com/manuals/motherboard/X12/MNL-2365.pdf',
  }

  private static readonly chipsetDocumentation = {
    title: 'Intel / C600 chipset datasheet: I/O interfaces, clocks, reset, SPI, and RTC',
    url: 'https://www.intel.com/content/dam/www/public/us/en/documents/datasheets/c600-series-chipset-datasheet.pdf',
  }

  private static readonly modelNote = 'This is a physical connection schematic, not a manufacturer board layout. Component integration, placement, wiring, and supply requirements vary by platform; the linked documents are reference examples.'

  private static readonly entries: Readonly<Record<string, HardwareElementInformation>> = {
    'bus-motherboard': {
      photos: [],
      overview: 'The motherboard holds the system sockets, connectors, platform chips, power circuits, and copper wiring that connect installed components.',
      problem: 'It gives the processor, memory, storage, and expansion devices a shared physical platform with the required electrical connections.',
      characteristicNote: this.modelNote,
      characteristics: [
        { name: 'Physical attachments', value: 'CPU and DIMM sockets, PCIe slots, M.2, SATA, and USB connectors provide the illustrated device connections.' },
        { name: 'Signal routing', value: 'Separate copper routes carry DDR, PCIe, chipset-link, SATA, USB, clock, and reset signals.' },
        { name: 'Power', value: 'The PSU supplies DC. Motherboard regulators and distribution deliver the rails needed by supported components.' },
      ],
      documentation: [this.boardDocumentation],
    },
    'bus-fabric': {
      photos: MotherboardIllustrations.pcbTraces,
      overview: 'PCB traces and reference planes form the physical electrical paths between component contacts.',
      problem: 'They carry signals between the CPU socket, platform chips, and device connectors.',
      characteristicNote: 'The central outline identifies a routing area, rather than a chip or shared protocol controller. Drawn crossings can represent different PCB layers and are not electrical junctions.',
      characteristics: [
        { name: 'Independent links', value: 'GPU, NVMe SSD, and NIC each have their own illustrated PCIe connection.' },
        { name: 'Memory path', value: 'DDR wiring connects the CPU socket memory contacts directly to the DIMM socket.' },
        { name: 'Processing', value: 'Protocol handling occurs inside the CPU, chipset, and connected devices; copper routing does not process requests.' },
      ],
      documentation: [this.boardDocumentation, this.chipsetDocumentation],
    },
    'bus-clock-reset': {
      photos: MotherboardIllustrations.clockGenerator,
      overview: 'Reference-clock generation and buffer circuitry supply clock signals to the platform components that require them.',
      problem: 'It provides the timing references needed for compatible interfaces and component operation.',
      characteristicNote: 'This block groups clock generation and buffering. Reset distribution has its own block. Frequencies, sources, and integration are platform-specific.',
      characteristics: [
        { name: 'Destinations', value: 'The schematic shows separate reference-clock paths to CPU socket control contacts, PCH, GPU slot, M.2, and NIC slot.' },
        { name: 'Distribution', value: 'Buffers can distribute the required clock signals to multiple loads.' },
        { name: 'Power', value: 'Clock circuitry receives motherboard DC supply separately from its signal outputs.' },
      ],
      documentation: [this.chipsetDocumentation],
    },
    'bus-reset-circuit': {
      photos: MotherboardIllustrations.resetControl,
      overview: 'Board reset circuitry qualifies and distributes reset signals as the platform starts or changes operating state.',
      problem: 'It helps components enter known states while their power and timing conditions become valid.',
      characteristicNote: 'The block groups physical supervision, power-good qualification, sequencing, and fan-out. Exact reset sources and timing vary, and chipset logic can participate.',
      characteristics: [
        { name: 'Destinations', value: 'Separate illustrated routes reach the CPU socket, PCH, GPU slot, M.2, and NIC slot.' },
        { name: 'Signal role', value: 'Reset signals control initialization state; they do not carry application payloads.' },
        { name: 'Support supply', value: 'The circuit uses the appropriate main or standby support rail for the platform.' },
      ],
      documentation: [this.chipsetDocumentation],
    },
    'bus-power': {
      photos: MotherboardIllustrations.dcRegulation,
      overview: 'The motherboard power section combines incoming DC connections and the regulation needed to supply board loads.',
      problem: 'Different components need controlled supply rails rather than an undifferentiated connection to the PSU.',
      characteristicNote: this.modelNote,
      characteristics: [
        { name: 'Input', value: 'Main-board and CPU power connectors receive PSU DC output.' },
        { name: 'Regulation', value: 'Board regulators derive the rails required by the installed platform.' },
        { name: 'Distribution', value: 'Copper power planes and traces deliver supplies to sockets, slots, and chips. AC conversion remains in the PSU.' },
      ],
      documentation: [this.boardDocumentation],
    },
    'bus-power-connectors': {
      photos: [],
      overview: 'Main-board and CPU power inputs are the physical connections accepting DC supply from the chassis PSU.',
      problem: 'They bring power and return connections onto the board for regulation and distribution.',
      characteristicNote: 'Connector shapes, contact assignments, current ratings, and required cables depend on the motherboard. The diagram does not prescribe a specific connector standard.',
      characteristics: [
        { name: 'Supply source', value: 'The external PSU converts AC to DC before power reaches these inputs.' },
        { name: 'Downstream path', value: 'Inputs feed the board regulation and power-distribution arrangement.' },
        { name: 'Electrical role', value: 'These power contacts are separate from PCIe, DDR, SATA, and other data connections.' },
      ],
      documentation: [this.boardDocumentation],
    },
    'bus-vrm': {
      photos: [],
      overview: 'Voltage regulator modules and related board regulators convert incoming DC into controlled supply rails.',
      problem: 'They provide voltages and power delivery suited to processor and platform loads.',
      characteristicNote: 'This block groups regulation functions. It does not claim one common voltage, regulator, phase count, or physical power-stage design for every load.',
      characteristics: [
        { name: 'Input', value: 'Receives DC through the motherboard power-input arrangement.' },
        { name: 'Output', value: 'Produces regulated rails for the relevant components and distribution paths.' },
        { name: 'Load dependence', value: 'Rail requirements and regulation placement depend on the CPU, memory generation, and board design.' },
      ],
      documentation: [this.boardDocumentation],
    },
    'bus-power-rails': {
      photos: [],
      overview: 'Motherboard DC rails are the power and return networks connecting supply circuitry to board loads.',
      problem: 'They distribute the required electrical supplies across the platform.',
      characteristicNote: 'The single block groups multiple separate rails and copper distribution paths. It does not imply that every connected component uses one supply voltage.',
      characteristics: [
        { name: 'Destinations', value: 'The map supplies CPU, DIMM, PCH, GPU slot, M.2, NIC slot, clock generation, and reset circuitry.' },
        { name: 'Connector contacts', value: 'Installed devices receive board-supplied power through the appropriate socket or slot contacts.' },
        { name: 'Drawing key', value: 'Amber arrows identify electrical power paths; data and support signals use separate routes.' },
      ],
      documentation: [this.boardDocumentation],
    },
    'bus-pch': {
      photos: MotherboardIllustrations.chipset,
      overview: 'The Platform Controller Hub is a chipset device providing platform I/O and support functions.',
      problem: 'It connects supported peripheral interfaces and platform services to the processor through a chipset uplink.',
      characteristicNote: 'PCH is Intel platform terminology. Other systems partition these functions differently or integrate them into an SoC. The map does not describe one exact chipset SKU.',
      characteristics: [
        { name: 'Host link', value: 'A distinct DMI or platform-specific uplink connects the CPU chipset contacts to this chip.' },
        { name: 'Shown interfaces', value: 'The illustrated PCH provides the SATA, USB, and firmware SPI host interfaces.' },
        { name: 'Direct CPU paths', value: 'The shown DDR, GPU PCIe, NIC PCIe, and NVMe PCIe paths connect directly through CPU socket contacts.' },
      ],
      documentation: [this.chipsetDocumentation, this.boardDocumentation],
    },
    'bus-flash': {
      photos: MotherboardIllustrations.spiFlash,
      overview: 'The SPI flash device stores persistent motherboard boot firmware, commonly implementing a UEFI firmware environment.',
      problem: 'It retains platform startup code while the system is powered off.',
      characteristicNote: 'SPI describes the chip interface; UEFI describes a firmware interface and environment. Flash capacity, contents, update policy, and additional firmware devices vary.',
      characteristics: [
        { name: 'Persistence', value: 'Nonvolatile flash retains its stored firmware without continuous power.' },
        { name: 'Connection', value: 'The diagram connects the flash chip to the PCH SPI interface through PCB traces.' },
        { name: 'Scope', value: 'This chip is motherboard firmware storage, separate from the SSD and its internal controller firmware.' },
      ],
      documentation: [this.boardDocumentation, this.chipsetDocumentation],
    },
    'bus-rtc': {
      photos: MotherboardIllustrations.rtcBattery,
      overview: 'The real-time clock and its backup-supply context support timekeeping when normal platform power is unavailable.',
      problem: 'They allow the platform to retain time and supported battery-backed state across power interruptions.',
      characteristicNote: 'The drawing groups RTC and battery context. The RTC can be integrated in the chipset; firmware settings may also reside in nonvolatile flash, so the battery does not power all configuration storage.',
      characteristics: [
        { name: 'Backup power', value: 'The battery supplies the supported low-power timekeeping domain when required.' },
        { name: 'Platform context', value: 'The map associates RTC support with the PCH rather than a user-data transfer path.' },
        { name: 'Scope', value: 'RTC backup does not keep system RAM, the CPU, or attached drives operating.' },
      ],
      documentation: [this.boardDocumentation, this.chipsetDocumentation],
    },
  }

  public static get(regionId: string | null): HardwareElementInformation | null {
    if (regionId === null) return null
    const source = this.socketSources[regionId]
    if (source) return ServerConnectorInformation.get(source)
    return this.entries[regionId] ?? null
  }
}
