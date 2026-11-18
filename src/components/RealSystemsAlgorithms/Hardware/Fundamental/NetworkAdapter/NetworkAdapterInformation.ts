import type { HardwareElementInformation } from '../../../../../visualization/HardwareElementInformation.ts'
import { NetworkAdapterIllustrations } from './NetworkAdapterIllustrations.ts'

export class NetworkAdapterInformation {
  private static readonly controllerDocumentation = {
    title: 'Intel / Ethernet Controller E810 datasheet',
    url: 'https://cdrdv2.intel.com/v1/dl/getContent/613875',
  }

  private static readonly architectureDocumentation = {
    title: 'Intel / Ethernet Network Adapter E810-XXVDA2 product brief',
    url: 'https://cdrdv2.intel.com/v1/dl/getContent/641674',
  }

  private static readonly dmaDocumentation = {
    title: 'Linux kernel / DMA addresses, mappings, and driver responsibilities',
    url: 'https://docs.kernel.org/core-api/dma-api-howto.html',
  }

  private static readonly exampleNote = 'This is a functional view of controller circuitry and storage. Integration and organization vary by adapter; the component map is not a physical silicon floorplan.'

  private static readonly entries: Readonly<Record<string, HardwareElementInformation>> = {
    'nic-board': {
      photos: NetworkAdapterIllustrations.board(),
      overview: 'An Ethernet adapter is a physical circuit board that connects the computer to a wired network. It carries the controller, network connection hardware, host contacts, and supporting electronics.',
      problem: 'It provides the electrical connections and electronics needed to move network data between host memory and an Ethernet cable.',
      characteristicNote: 'This annotated image was supplied by the user. It shows a PCIe x1 Ethernet adapter with a copper network port. The model and link speed are not established. Labels are reproduced as supplied; they do not establish exact chip identities or internal circuit locations.',
      characteristics: [
        { name: 'Physical assembly', value: 'The PCB holds components and routes signals and power through copper conductors.' },
        { name: 'Host attachment', value: 'A PCIe x1 edge connector is visible along the lower edge of the board.' },
        { name: 'Controller area', value: 'The image labels a heatsink-covered area; circuitry beneath it is not visible.' },
        { name: 'Network attachment', value: 'One RJ45 copper Ethernet port with nearby link/activity indicators.' },
        { name: 'Power', value: 'This card receives DC power through its motherboard PCIe slot.' },
      ],
      documentation: [this.dmaDocumentation],
    },
    'nic-host-connector': {
      photos: NetworkAdapterIllustrations.hostConnector(),
      overview: 'The gold fingers on a PCIe adapter board are physical host-connector contacts. They mate with a compatible motherboard PCIe slot.',
      problem: 'The connector provides a removable electrical connection for data, power, and support signals between the card and computer.',
      characteristicNote: 'PCIe contacts carry data, power, and support signals. DMA is a transfer mechanism using the PCIe connection, rather than an additional physical connector.',
      characteristics: [
        { name: 'Physical representation', value: 'Conductive pads on the card edge, with a keyed gap between contact groups.' },
        { name: 'Connector versus interface', value: 'The connector is passive; bus transactions are handled by controller circuitry.' },
        { name: 'DMA', value: 'Packet transfers use PCIe transactions and do not need a separate DMA cable.' },
        { name: 'Host memory', value: 'The driver prepares and maps memory buffers before the adapter accesses them.' },
      ],
      documentation: [this.architectureDocumentation, this.dmaDocumentation],
    },
    'nic-controller': {
      photos: NetworkAdapterIllustrations.controller(),
      overview: 'The network controller is a physical integrated circuit containing silicon that coordinates host transfers and Ethernet transmission and reception.',
      problem: 'It combines packet movement, buffering, frame handling, and device control so the computer can send and receive network traffic.',
      characteristicNote: 'The supplied images show a Microchip ENC424J600 package and its 44-pin connection diagram. This separate example uses SPI or an 8-bit multiplexed parallel host interface; the adapter map illustrates PCIe. The images do not identify the controller on the separate adapter board. A controller can integrate the host interface, DMA, MAC, packet memory, and management logic. PHY integration depends on the device. Package photographs and pin diagrams do not show the layout of internal circuits.',
      characteristics: [
        { name: 'Visible hardware', value: 'The silicon die is contained in a chip package mounted on the board, often beneath a heatsink.' },
        { name: 'Integrated functions', value: 'Host-interface circuitry, DMA, control logic, packet memory, and MAC functions can share one controller.' },
        { name: 'Separate storage', value: 'Configuration or boot storage can be outside the controller package.' },
        { name: 'Product example', value: 'Microchip ENC424J600 integrates a 10/100 Mb/s Ethernet MAC and PHY with 24 KB of transmit/receive packet SRAM.' },
      ],
      documentation: [{
        title: 'Microchip / ENC424J600 Ethernet controller',
        url: 'https://www.microchip.com/en-us/product/ENC424J600',
      }, {
        title: 'Microchip / ENC424J600 and ENC624J600 datasheet: features and pin diagrams',
        url: 'https://ww1.microchip.com/downloads/aemDocuments/documents/OTH/ProductDocuments/DataSheets/39935c.pdf',
      }, this.controllerDocumentation, this.architectureDocumentation],
    },
    'nic-firmware': {
      photos: [],
      overview: 'Configuration and firmware are stored information. The physical component is the memory containing those bits, such as EEPROM or flash, which may be internal or external to a controller.',
      problem: 'Nonvolatile storage preserves device settings, identification, and supported boot or firmware code while power is off.',
      characteristicNote: 'The memory technology, package location, and firmware organization depend on the adapter. Firmware contents are distinct from the physical memory that stores them.',
      characteristics: [
        { name: 'Hardware versus contents', value: 'Memory cells are hardware; firmware instructions and configuration values are their contents.' },
        { name: 'Configuration', value: 'Stored fields can include a MAC address and device initialization settings.' },
        { name: 'Code storage', value: 'Some adapters have flash for boot code; not every adapter has the same firmware organization.' },
        { name: 'Volatile working state', value: 'Runtime registers and working memory are distinct from persistent storage.' },
      ],
      documentation: [this.architectureDocumentation, this.controllerDocumentation],
    },
    'nic-control': {
      photos: [],
      overview: 'Control and queue management is implemented by physical controller logic and registers. The queues it manages are logical structures backed by memory.',
      problem: 'It tracks available work, selects buffers, coordinates transfers, and tells the host when work has completed.',
      characteristicNote: this.exampleNote,
      characteristics: [
        { name: 'Hardware', value: 'State machines, registers, descriptor-fetch circuitry, and completion logic.' },
        { name: 'Host structures', value: 'The driver prepares descriptor rings and memory buffers; those structures are not separate controller chips.' },
        { name: 'Coordination', value: 'Queue state controls when DMA reads outgoing data or writes received data.' },
        { name: 'Notifications', value: 'Completion records and interrupts let the host reclaim or reuse buffers.' },
      ],
      documentation: [this.architectureDocumentation, this.dmaDocumentation],
    },
    'nic-host-interface': {
      photos: [],
      overview: 'The host interface is real circuitry inside the controller that communicates with the computer. This component map illustrates a PCIe interface.',
      problem: 'It implements host-bus transactions carrying packet data, descriptor accesses, register operations, and notifications.',
      characteristicNote: this.exampleNote,
      characteristics: [
        { name: 'Physical implementation', value: 'Electrical interface and digital bus-protocol logic inside the controller.' },
        { name: 'Connector distinction', value: 'The gold edge contacts connect the card; the host-interface circuitry actively implements the link.' },
        { name: 'Traffic types', value: 'DMA payloads use the host connection along with configuration and control traffic.' },
        { name: 'Other adapters', value: 'USB and integrated adapters use other host-interface arrangements.' },
      ],
      documentation: [this.architectureDocumentation, this.dmaDocumentation],
    },
    'nic-dma': {
      photos: [],
      overview: 'The DMA engine is physical digital circuitry that reads and writes host memory through the host interface using addresses and descriptors supplied by the driver.',
      problem: 'It moves packet data without requiring the CPU to copy each byte between host RAM and the adapter.',
      characteristicNote: this.exampleNote,
      characteristics: [
        { name: 'Transmit', value: 'Reads outgoing bytes from mapped host buffers and stages them for transmission.' },
        { name: 'Receive', value: 'Writes incoming bytes into host receive buffers prepared by the driver.' },
        { name: 'Addresses', value: 'Uses device DMA addresses; platform address translation may involve an IOMMU.' },
        { name: 'CPU involvement', value: 'Software still configures buffers, ownership, and transfer requests.' },
      ],
      documentation: [this.dmaDocumentation, this.architectureDocumentation],
    },
    'nic-buffers': {
      photos: [],
      overview: 'Packet buffers are physical memory on the adapter that temporarily holds outgoing and incoming frame data. On-chip SRAM is commonly used for this role.',
      problem: 'Buffering absorbs differences between host-transfer timing and Ethernet line timing, helping prevent transmit starvation and receive overflow.',
      characteristicNote: this.exampleNote,
      characteristics: [
        { name: 'Storage type', value: 'Volatile working memory, distinct from persistent firmware or configuration storage.' },
        { name: 'Organization', value: 'TX and RX storage may be partitions of a shared memory rather than independent chips.' },
        { name: 'Capacity', value: 'Buffer capacity and allocation depend on the controller and its configuration.' },
        { name: 'Host distinction', value: 'On-adapter buffers and driver-allocated packet buffers in host RAM are different storage locations.' },
      ],
      documentation: [this.controllerDocumentation, this.architectureDocumentation],
    },
    'nic-tx-buffer': {
      photos: [],
      overview: 'The transmit buffer is the portion of adapter memory used to stage outgoing data before the MAC sends it. TX names a storage role, backed by physical memory cells.',
      problem: 'It keeps outgoing data available while host access and network transmission proceed at different times.',
      characteristicNote: this.exampleNote,
      characteristics: [
        { name: 'Input', value: 'Packet bytes read by DMA from host memory.' },
        { name: 'Output', value: 'Data supplied to the transmit packet-processing and MAC path.' },
        { name: 'Physical placement', value: 'Usually within controller memory; TX does not imply a separate visible chip.' },
        { name: 'Allocation', value: 'The amount of memory assigned to TX depends on controller design and configuration.' },
      ],
      documentation: [this.architectureDocumentation, this.controllerDocumentation],
    },
    'nic-rx-buffer': {
      photos: [],
      overview: 'The receive buffer is the portion of adapter memory that stages incoming data before DMA transfers it to host memory. RX is a logical use of physical storage.',
      problem: 'It gives the adapter temporary space for incoming data while waiting for access to prepared host buffers.',
      characteristicNote: this.exampleNote,
      characteristics: [
        { name: 'Input', value: 'Received data from the MAC and receive-processing path.' },
        { name: 'Output', value: 'Bytes written by DMA into driver-prepared host buffers.' },
        { name: 'Limited space', value: 'Receive buffering is finite; insufficient space or available host buffers can cause packet drops.' },
        { name: 'Memory role', value: 'RX may share a memory array with TX through separate allocation and control.' },
      ],
      documentation: [this.architectureDocumentation, this.dmaDocumentation],
    },
    'nic-mac': {
      photos: [],
      overview: 'The Media Access Control block is physical digital circuitry that handles Ethernet frame transmission and reception. A MAC address and an Ethernet frame are data processed by this circuitry.',
      problem: 'It applies Ethernet framing and frame-check rules and connects the adapter packet path to the physical-layer interface.',
      characteristicNote: 'MAC circuitry is commonly integrated into the network controller. Its location within the silicon cannot be inferred from an external package photograph.',
      characteristics: [
        { name: 'Transmit', value: 'Handles framing and Ethernet frame check sequence (FCS) generation.' },
        { name: 'Receive', value: 'Checks incoming frames and applies configured acceptance rules.' },
        { name: 'MAC versus PHY', value: 'MAC handles frames; PHY circuitry encodes and recovers link signals.' },
        { name: 'Checksum distinction', value: 'Ethernet FCS is different from optional IP, TCP, or UDP checksum offloads.' },
      ],
      documentation: [this.architectureDocumentation, this.controllerDocumentation],
    },
    'nic-phy': {
      photos: NetworkAdapterIllustrations.phy(),
      overview: 'The PHY is a physical-layer transceiver made from digital and analog circuitry. It translates between MAC-side data and the signaling used by an Ethernet link.',
      problem: 'It creates transmit signals and recovers incoming data despite the electrical constraints and noise of the physical connection.',
      characteristicNote: 'The photo shows a LAN8720 ETH Board: a complete module containing an Ethernet PHY chip, an RJ45 socket, headers, and supporting components. The small square chip near the center implements the PHY function shown in the diagram. This is a separate 10/100 Mb/s example; it does not identify the PHY in the adapter board photo. PHY functions may be integrated into a controller, implemented by a separate chip, or distributed across controller and transceiver hardware.',
      characteristics: [
        { name: 'Pictured example', value: 'LAN8720 Ethernet PHY module: 10BASE-T / 100BASE-TX, supporting 10 and 100 Mb/s copper links.' },
        { name: 'MAC connection', value: 'The LAN8720 uses RMII to connect to an external Ethernet MAC; the module still needs a host with MAC functionality.' },
        { name: 'Transmit circuitry', value: 'Encoding, signal processing, timing, and line-driving functions.' },
        { name: 'Receive circuitry', value: 'Signal reception and recovery; copper designs can include equalization and echo cancellation.' },
        { name: 'Link management', value: 'Supports link configuration, status reporting, and supported speed negotiation.' },
        { name: 'Connection hardware', value: 'Copper magnetics and a cable connector are distinct from PHY processing; optical variants use optical transceivers.' },
      ],
      documentation: [{
        title: 'Waveshare / LAN8720 ETH Board: Ethernet PHY module and RMII interface',
        url: 'https://www.waveshare.com/product/lan8720-eth-board.htm',
      }, {
        title: 'Microchip / LAN8720A: 10/100 Ethernet PHY with RMII interface',
        url: 'https://www.microchip.com/en-us/product/LAN8720A',
      }, {
        title: 'Microchip / LAN8720A and LAN8720Ai datasheet: PHY, magnetics, and RJ45 application diagram',
        url: 'https://ww1.microchip.com/downloads/aemDocuments/documents/UNG/ProductDocuments/DataSheets/LAN8720A-LAN8720Ai-Data-Sheet-DS00002165.pdf',
      }, this.controllerDocumentation, this.architectureDocumentation],
    },
    'nic-offload': {
      photos: [],
      overview: 'Hardware offloads are packet-processing capabilities implemented by circuitry in a supporting network controller. The name describes work assigned to hardware rather than a separate physical device.',
      problem: 'They reduce host CPU work by performing supported checksum calculations or splitting a large outgoing TCP packet into transmission-sized segments.',
      characteristicNote: 'Offload support depends on the controller, driver, and configuration. These capabilities are implemented within packet-processing circuitry rather than as a separately visible board component.',
      characteristics: [
        { name: 'Checksum processing', value: 'Can calculate or validate supported IP and transport checksums; Ethernet FCS remains a MAC responsibility.' },
        { name: 'TCP segmentation', value: 'Hardware uses driver-provided metadata to form smaller packets from a larger outgoing TCP payload.' },
        { name: 'Optional operation', value: 'Supported capabilities must be configured; ordinary packet traffic does not require every offload.' },
        { name: 'Software distinction', value: 'Linux Generic Segmentation Offload (GSO) is a software mechanism and is not this physical circuitry.' },
      ],
      documentation: [this.architectureDocumentation, {
        title: 'Linux kernel / segmentation offloads: TSO and software GSO',
        url: 'https://docs.kernel.org/networking/segmentation-offloads.html',
      }],
    },
  }

  public static get(regionId: string | null): HardwareElementInformation | null {
    if (regionId === null) return null
    return this.entries[regionId] ?? null
  }
}
