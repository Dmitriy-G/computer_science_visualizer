import type { HardwareElementInformation } from '../../../../../visualization/HardwareElementInformation.ts'
import { SsdNandInformation } from './SsdNandInformation.ts'

export class SsdInformation {
  private static readonly flashDocumentation = {
    title: 'Kingston / Flash Memory Guide: controllers, error correction, and endurance',
    url: 'https://media.kingston.com/pdfs/MKF-283.3-Flash-Memory-Guide_EN.pdf',
  }

  private static readonly controllerDocumentation = {
    title: 'Silicon Motion / SM2262EN controller: host interface, memory, and flash channels',
    url: 'https://www.siliconmotion.com/download/u/a/SM2262EN_PB_EN.pdf',
  }

  private static readonly hostDocumentation = {
    title: 'NVM Express / NVMe over PCIe transport specification',
    url: 'https://nvmexpress.org/specification/nvme-over-pcie-transport-specification/',
  }

  private static readonly modelNote = 'This is a logical component map. Functions can share controller silicon and firmware; placement and implementation vary by SSD.'

  private static readonly entries: Readonly<Record<string, HardwareElementInformation>> = {
    'ssd-pcb': {
      photos: [{
        src: '/hardware/ssd/annotated-m2-nvme-ssd.svg',
        alt: 'User-provided annotated M.2 NVMe SSD with blue outlines and labels identifying the edge connector, SSD controller, DRAM cache, NAND flash packages, PCB, and power-management area.',
        caption: 'Annotated M.2 NVMe SSD / board components',
        width: 1672,
        height: 941,
      }],
      overview: 'A solid-state drive combines a storage controller, nonvolatile NAND flash, and supporting electronics on a circuit board.',
      problem: 'It gives the host persistent block storage while managing the access rules and reliability limits of flash memory.',
      characteristicNote: 'The supplied M.2 NVMe board image preserves its original annotations; its exact model and capacity are not established here. It is a separate example from the schematic, which combines a generic SSD controller with explicitly modeled planar SLC NAND. Nonvolatile storage retains data without power but has finite retention and endurance.',
      characteristics: [
        { name: 'Main parts', value: 'Host connection, controller, NAND memory, and DC power circuitry; external DRAM is optional.' },
        { name: 'Persistence', value: 'NAND retains stored data without power; controller SRAM, DRAM, and working buffers are volatile.' },
        { name: 'Organization', value: 'The host sees logical blocks. Firmware manages their placement in physical NAND pages and erase blocks.' },
      ],
      documentation: [this.flashDocumentation, this.controllerDocumentation],
    },
    'ssd-connectors': {
      photos: [{
        src: '/hardware/ssd/annotated-m2-edge-connector.svg',
        alt: 'User-supplied annotated M.2 SSD edge connector illustration identifying PCB traces, edge contacts for PCIe, power, ground and control, the M-key notch, and the short contact section.',
        caption: 'M.2 SSD edge connector / illustrative contact groups, not a pin-by-pin map',
        width: 1536,
        height: 1024,
      }],
      overview: 'The host connector provides the electrical contacts connecting the drive to the computer and its DC supply.',
      problem: 'It supplies a physical attachment for storage communication and power.',
      characteristicNote: 'The data and power boxes group contact functions. Connector shape and power delivery depend on the drive form factor.',
      characteristics: [
        { name: 'Data attachment', value: 'The illustrated alternatives are PCIe carrying NVMe, or SATA; a drive uses its supported attachment.' },
        { name: 'Power contacts', value: 'An M.2 drive receives motherboard DC through its socket; a SATA drive can use a separate PSU power connector.' },
        { name: 'Passive connection', value: 'Contacts carry signals and power. The controller implements the communication protocol.' },
      ],
      documentation: [this.hostDocumentation, this.flashDocumentation],
    },
    'ssd-data': {
      photos: [],
      overview: 'The data link is the drive connection carrying commands, payload bytes, and completion information between host and SSD.',
      problem: 'It transports storage requests and their data across the physical host connection.',
      characteristicNote: 'PCIe and SATA are alternative attachments in this map. NVMe is a storage protocol carried over PCIe in the illustrated local connection.',
      characteristics: [
        { name: 'Traffic', value: 'Requests and write data enter the drive; read data and completion information return to the host.' },
        { name: 'Host memory', value: 'Transfers reach RAM through the platform I/O and memory system, rather than a direct SSD-to-DIMM wire.' },
      ],
      documentation: [this.hostDocumentation],
    },
    'ssd-power-input': {
      photos: [],
      overview: 'The power input accepts DC supply and ground for the drive electronics. Local power circuitry supplies the controller and memory.',
      problem: 'It provides the electrical energy needed for communication, computation, and NAND access.',
      characteristicNote: 'The map groups drive power management into this block. Supply voltages, regulation, and power-loss protection depend on the device.',
      characteristics: [
        { name: 'Source', value: 'Motherboard DC contacts or a PSU drive-power connection, according to the form factor.' },
        { name: 'Volatile state', value: 'Removing power loses unprotected SRAM, DRAM, and buffer contents.' },
        { name: 'Protection', value: 'Backup capacitors and power-loss recovery are device-specific features, not guaranteed by this diagram.' },
      ],
      documentation: [this.flashDocumentation],
    },
    'ssd-host-interface': {
      photos: [],
      overview: 'The host interface is active controller circuitry that receives storage requests and exchanges data and completions with the computer.',
      problem: 'It turns host protocol traffic into work the SSD controller can schedule.',
      characteristicNote: 'A locally attached NVMe SSD communicates over PCIe. SATA SSDs use a different host interface; both are shown as alternatives.',
      characteristics: [
        { name: 'Command handling', value: 'Accepts logical addresses and operation details, with protocol-defined request and completion handling.' },
        { name: 'Data path', value: 'Exchanges payloads with controller DMA and data buffers.' },
        { name: 'Media separation', value: 'Host commands are distinct from the physical NAND command/address interface.' },
      ],
      documentation: [this.hostDocumentation, this.controllerDocumentation],
    },
    'ssd-controller': {
      photos: [],
      overview: 'The SSD controller is an integrated circuit combining processing, interfaces, working memory, and flash-management hardware.',
      problem: 'It presents useful block storage while coordinating NAND access, address translation, data movement, and error recovery.',
      characteristicNote: this.modelNote,
      characteristics: [
        { name: 'Coordination', value: 'Firmware and hardware schedule requests across supported NAND channels.' },
        { name: 'Data protection', value: 'ECC encoding precedes programming, and decoding/correction follows NAND readback.' },
        { name: 'Management', value: 'Mapping, garbage collection, and wear leveling manage flash placement and reuse.' },
      ],
      documentation: [this.controllerDocumentation, this.flashDocumentation],
    },
    'ssd-cpu': {
      photos: [],
      overview: 'Internal processor cores execute the firmware that controls the SSD.',
      problem: 'They implement scheduling and flash-management policies that are more flexible than fixed logic alone.',
      characteristicNote: 'These are embedded controller processors, separate from the computer host CPU. Core count and instruction set are implementation choices.',
      characteristics: [
        { name: 'Firmware work', value: 'Coordinates requests, mapping updates, reclamation, and device management.' },
        { name: 'Working memory', value: 'Uses controller SRAM and other available memory for code and state.' },
        { name: 'Hardware assistance', value: 'Dedicated DMA, ECC, and NAND-interface logic handle specialized transfers and processing.' },
      ],
      documentation: [this.controllerDocumentation],
    },
    'ssd-sram': {
      photos: [],
      overview: 'Controller SRAM is volatile on-chip memory used for runtime firmware, working state, and temporary metadata.',
      problem: 'It gives controller processors and hardware quick access to active information.',
      characteristicNote: 'SRAM does not preserve firmware or mapping updates after power removal. Persistent backing belongs in ROM or flash; exact boot and recovery arrangements vary.',
      characteristics: [
        { name: 'Lifetime', value: 'Contents are working state while the drive is powered.' },
        { name: 'Uses', value: 'Can hold runtime code, mapping caches, and other controller metadata.' },
        { name: 'Separate memory', value: 'On-chip SRAM is distinct from optional external DRAM and NAND page-buffer latches.' },
      ],
      documentation: [this.controllerDocumentation, this.flashDocumentation],
    },
    'ssd-ftl': {
      photos: [],
      overview: 'The Flash Translation Layer is the controller mapping and management logic connecting host logical block addresses to NAND locations.',
      problem: 'It lets the host update logical data even though NAND writes require suitable page space and erasure happens a block at a time.',
      characteristicNote: 'FTL is a firmware/hardware function backed by metadata, rather than a separate mandatory chip. The map does not specify a production mapping algorithm.',
      characteristics: [
        { name: 'Translation', value: 'Looks up the physical location for a logical address and manages new destinations for writes.' },
        { name: 'Updates', value: 'An overwrite can place data in a different erased page and change the logical mapping.' },
        { name: 'Coordination', value: 'Works with garbage collection and wear leveling to reclaim space and distribute use.' },
      ],
      documentation: [this.flashDocumentation],
    },
    'ssd-physical-address': {
      photos: [],
      overview: 'The translated NAND address identifies where a logical range is stored in the flash hierarchy.',
      problem: 'It directs an SSD request to the correct channel, selected target, die, plane, block, and page.',
      characteristicNote: 'This box represents translation metadata, not another physical memory chip. Exact address fields and mapping granularity vary.',
      characteristics: [
        { name: 'Hierarchy', value: 'A page belongs to an erase block within a plane and die, reached through a selected NAND channel and target.' },
        { name: 'Within-page position', value: 'A host logical sector can occupy only part of a NAND page, requiring an offset.' },
        { name: 'Lesson example', value: 'The page lessons select channel 0, target 0, die 0, plane 0, block 0, page 0.' },
      ],
      documentation: [this.flashDocumentation, SsdNandInformation.arrayDocumentation],
    },
    'ssd-garbage-collection': {
      photos: [],
      overview: 'Garbage collection is controller work that recovers reusable flash space from blocks containing outdated data.',
      problem: 'NAND cannot erase an individual obsolete page while preserving other pages in the same block.',
      characteristicNote: 'This is a flash-management policy, not a separate physical chip. The two page-access lessons do not run a block erase.',
      characteristics: [
        { name: 'Preserve first', value: 'Relocates still-valid pages and updates their mappings before reclaiming their old block.' },
        { name: 'Reclaim', value: 'Erases the selected block so its pages can be programmed again.' },
        { name: 'Extra work', value: 'Internal copying adds writes beyond the payload requested by the host.' },
      ],
      documentation: [this.flashDocumentation],
    },
    'ssd-wear-leveling': {
      photos: [],
      overview: 'Wear leveling is controller policy that distributes program/erase activity across flash blocks.',
      problem: 'Repeatedly reusing only a small set of blocks would wear them out while other blocks remain lightly used.',
      characteristicNote: 'Flash endurance is finite. Wear leveling distributes use; it does not remove wear or guarantee a fixed lifetime for every workload.',
      characteristics: [
        { name: 'Wear metadata', value: 'Firmware tracks block-use information when choosing destinations.' },
        { name: 'Placement', value: 'New writes and internal relocation can spread activity across available blocks.' },
        { name: 'Policy distinction', value: 'Wear leveling balances use; garbage collection primarily reclaims space. Their work can overlap.' },
      ],
      documentation: [this.flashDocumentation],
    },
    'ssd-dma': {
      photos: [],
      overview: 'DMA engines and data buffers move and temporarily stage payloads inside the controller data path.',
      problem: 'They transfer page data between host-interface circuitry, error-correction stages, and NAND controllers without firmware copying every byte.',
      characteristicNote: 'This block groups transfer hardware and volatile buffers. It is distinct from both host RAM and NAND die page-buffer latches.',
      characteristics: [
        { name: 'Write direction', value: 'Stages host payloads before ECC encoding and NAND programming.' },
        { name: 'Read direction', value: 'Receives corrected NAND data before host delivery.' },
        { name: 'DRAM branch', value: 'Optional external DRAM can support buffering; it is not a mandatory serial stage.' },
      ],
      documentation: [this.controllerDocumentation, this.hostDocumentation],
    },
    'ssd-ecc': {
      photos: [],
      overview: 'Error-correcting code engines add redundancy to stored data and use it to detect and correct supported read errors.',
      problem: 'NAND reads can contain bit errors caused by wear, retention, and other physical effects.',
      characteristicNote: 'Encode and decode boxes are logical stages. The diagram does not claim a particular ECC code or simulate parity bits.',
      characteristics: [
        { name: 'Write stage', value: 'Generates redundancy associated with the data before it is programmed.' },
        { name: 'Read stage', value: 'Checks the returned codeword and attempts correction before delivering the payload.' },
        { name: 'Limits', value: 'Correction capability is finite; an uncorrectable error must be reported.' },
      ],
      documentation: [this.controllerDocumentation, this.flashDocumentation],
    },
    'ssd-ecc-encode': {
      photos: [],
      overview: 'ECC encoding computes error-control redundancy from write data.',
      problem: 'It supplies the information needed to detect and correct supported errors when the data is read later.',
      characteristicNote: 'The page lesson shows encoding as a conceptual stage. Redundancy size and placement depend on the NAND and controller design.',
      characteristics: [
        { name: 'Input', value: 'Payload from the controller data buffer.' },
        { name: 'Output', value: 'Data with associated ECC redundancy, passed to the NAND programming path.' },
        { name: 'Scope', value: 'Encoding protects data; it does not perform block erasure or address translation.' },
      ],
      documentation: [this.controllerDocumentation, SsdNandInformation.arrayDocumentation],
    },
    'ssd-ecc-decode': {
      photos: [],
      overview: 'ECC decoding checks NAND readback and attempts to recover the original data using its stored redundancy.',
      problem: 'It prevents correctable raw flash errors from becoming incorrect host data.',
      characteristicNote: 'Decoding follows sensing and NAND I/O in this map. The lesson models the stage without injecting or correcting individual codeword bits.',
      characteristics: [
        { name: 'Input', value: 'NAND read data and its associated error-control information.' },
        { name: 'Success', value: 'Corrected payload goes to the controller buffer before host delivery.' },
        { name: 'Failure', value: 'Errors beyond the available correction capability are reported instead of silently accepted.' },
      ],
      documentation: [this.controllerDocumentation, this.flashDocumentation],
    },
    'ssd-nand-controllers': {
      photos: [],
      overview: 'NAND channel controllers implement the command, timing, and data-transfer interface between the SSD controller and flash devices.',
      problem: 'They turn scheduled physical operations into the bus transactions required by the selected NAND.',
      characteristicNote: 'The model has two channels and groups one logical controller per channel. Real implementations can share circuitry and use different channel counts.',
      characteristics: [
        { name: 'Operations', value: 'Issues page reads, page programs, block erases, and status requests.' },
        { name: 'Payload path', value: 'Receives encoded writes and returns NAND readback to the ECC decoder.' },
        { name: 'Control path', value: 'Receives physical addresses and commands separately from payload processing.' },
      ],
      documentation: [this.controllerDocumentation, SsdNandInformation.arrayDocumentation],
    },
    'ssd-nand-command-io': {
      photos: [],
      overview: 'Command, timing, and data I/O logic drives the selected NAND channel and observes its responses.',
      problem: 'It sequences bus activity so the correct device receives commands, addresses, and payload bytes at the required times.',
      characteristicNote: 'The external NAND interface is separate from PCIe/NVMe or SATA. This block belongs to the SSD controller; the NAND die has its own command and I/O logic.',
      characteristics: [
        { name: 'Shared pins', value: 'Commands, addresses, status, and data use the NAND interface at different phases.' },
        { name: 'Selection', value: 'Transfers target a selected device on the shared channel.' },
        { name: 'Completion', value: 'Program and erase status is distinct from a read-data payload.' },
      ],
      documentation: [SsdNandInformation.arrayDocumentation],
    },
    'ssd-dram': {
      photos: [{
        src: '/hardware/ssd/dram.svg',
        alt: 'User-supplied DRAM package photograph showing a marked package top and the solder-ball contacts on the underside of another package.',
        caption: 'DRAM packages',
        description: 'The marked top of one memory package and solder-ball contacts on the underside of another.',
        width: 800,
        height: 800,
      }],
      overview: 'Optional external DRAM supplies volatile working space for mapping information and buffers.',
      problem: 'It can hold more active metadata and buffered data than the controller on-chip memory alone.',
      characteristicNote: 'DRAM is optional. DRAM-less controllers use other arrangements, and supported NVMe designs can use a Host Memory Buffer. External DRAM is not persistent storage.',
      characteristics: [
        { name: 'Uses', value: 'Can cache translation tables and stage working data, according to the controller design.' },
        { name: 'Volatility', value: 'Contents do not survive power removal without appropriate protection.' },
        { name: 'Topology', value: 'Shown as a branch from the controller, rather than a mandatory stage in every transfer.' },
      ],
      documentation: [this.controllerDocumentation, {
        title: 'Silicon Motion / SM2261XT: DRAM-less design and Host Memory Buffer support',
        url: 'https://www.siliconmotion.com/download/3fy/a/SM2261XT_PB_EN.pdf',
      }],
    },
    'ssd-firmware-nvm': {
      photos: [],
      overview: 'Nonvolatile ROM or flash holds the persistent firmware backing used to start and operate the SSD controller.',
      problem: 'It preserves controller code across power cycles, when volatile runtime memory is empty.',
      characteristicNote: 'This is logical backing-storage context, not a claim that every SSD has an extra firmware chip or an additional NAND package.',
      characteristics: [
        { name: 'Persistence', value: 'Boot code or firmware images reside in nonvolatile memory.' },
        { name: 'Runtime', value: 'Code can be loaded into SRAM for execution; exact boot and execution arrangements vary.' },
        { name: 'Implementation', value: 'Controller ROM and firmware images in NAND or other flash are device-specific choices.' },
      ],
      documentation: [this.flashDocumentation, this.controllerDocumentation],
    },
  }

  public static get(regionId: string | null): HardwareElementInformation | null {
    if (regionId === null) return null
    return this.entries[regionId] ?? SsdNandInformation.get(regionId)
  }
}
