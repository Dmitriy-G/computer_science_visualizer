import type { HardwareElementInformation } from '../../../visualization/HardwareElementInformation.ts'

export class ServerConnectorInformation {
  private static readonly boardDocumentation = {
    title: 'Supermicro / Motherboard manual: processor, memory, expansion, and storage connections',
    url: 'https://www.supermicro.com/manuals/motherboard/X12/MNL-2365.pdf',
  }

  private static readonly pcieDocumentation = {
    title: 'NI / PCIe card and slot lane-width compatibility',
    url: 'https://knowledge.ni.com/KnowledgeArticleDetails?id=kA00Z000000kJNkSAM',
  }

  private static readonly entries: Readonly<Record<string, HardwareElementInformation>> = {
    'cpu-socket': {
      photos: [{
        src: '/hardware/server-connectors/01_cpu_socket.svg',
        alt: 'Supplied annotated LGA CPU socket example with callouts for the spring contacts, retention bracket, and locking lever.',
        caption: 'CPU socket / annotated LGA example',
        width: 657, height: 465,
      }],
      overview: 'The CPU socket mechanically holds a compatible processor package and connects its electrical contacts to the motherboard.',
      problem: 'It provides a removable, aligned connection for processor signals, power, and ground.',
      characteristicNote: 'The supplied image illustrates LGA socket construction. It does not identify the socket model or the processor platform of this generic server map or the separate reference motherboard manual.',
      characteristics: [
        { name: 'Contacts', value: 'An LGA socket uses spring contacts that mate with lands on the processor package.' },
        { name: 'Retention', value: 'The bracket and locking mechanism hold the package in its intended position.' },
        { name: 'Controller location', value: 'Memory and I/O controllers remain in the CPU. The socket carries their signals and motherboard-supplied power.' },
      ],
      documentation: [this.boardDocumentation],
    },
    'dimm-sockets': {
      photos: [{
        src: '/hardware/server-connectors/02_dimm_sockets.svg',
        alt: 'Supplied annotated DIMM socket image showing contacts inside the slot, the mechanical key, and a retention clip.',
        caption: 'DIMM sockets / contacts, key, and retention clip',
        width: 727, height: 465,
      }],
      overview: 'DIMM sockets connect removable memory modules to the motherboard memory wiring and supply contacts.',
      problem: 'They align and retain a compatible module while connecting it to the CPU memory controller.',
      characteristicNote: 'The photo does not establish the exact module generation. DDR4 and DDR5 use different keying and electrical interfaces and are not interchangeable.',
      characteristics: [
        { name: 'Mechanical key', value: 'The slot key must align with the notch on the supported memory module.' },
        { name: 'Retention', value: 'Clips retain the module; latch arrangements depend on the socket.' },
        { name: 'Connection', value: 'DDR signals reach the CPU memory controller through board traces; the socket also carries module power and ground.' },
      ],
      documentation: [{
        title: 'Kingston / DDR4 and DDR5 compatibility and physical keying',
        url: 'https://www.kingston.com/en/blog/pc-performance/ddr-memory-generation-differences',
      }, this.boardDocumentation],
    },
    'host-usb-ports': {
      photos: [{
        src: '/hardware/server-connectors/03_usb_ports.svg',
        alt: 'Original stacked USB Type-A port image with corrected labels identifying the metal housing and internal metal spring tabs. The blue insulating tongues are visible above the tabs.',
        caption: 'USB Type-A ports / annotated rear I/O example',
        width: 583, height: 468,
      }, {
        src: '/hardware/motherboard/usb-header-annotated.svg',
        alt: 'Supplied annotated internal USB 2.0 header example identifying the plastic base, contacts, and vacant key position.',
        caption: 'Internal USB header / supplied annotated motherboard example',
        width: 583, height: 263,
      }],
      overview: 'USB ports connect external peripherals to the motherboard USB host controller.',
      problem: 'They provide a standardized removable connection for peripheral data and bus power.',
      characteristicNote: 'USB 2.0 Type-A has four electrical contacts, and SuperSpeed Type-A adds five for nine total. The four legacy contacts are VBUS, ground, D+, and D-. The photo callouts identify the visible metal housing and tabs; they are not a contact pinout. The separate internal-header image illustrates a different connector; header layouts depend on the motherboard.',
      characteristics: [
        { name: 'Housing and tongue', value: 'The metal shell and insulating tongue guide the plug and position its contacts.' },
        { name: 'Signals and supply', value: 'Separate contacts carry USB signals, power, and return. SuperSpeed uses additional signal contacts.' },
        { name: 'Diagram role', value: 'The external USB line reaches these ports; controller logic is elsewhere on the platform.' },
      ],
      documentation: [{
        title: 'USB-IF / USB 3.1 legacy connectors and cable assemblies compliance document',
        url: 'https://www.usb.org/sites/default/files/CabConn_Legacy_3_1_Compliance_Rev_1_1.pdf',
      }],
    },
    'nvme-connector': {
      photos: [{
        src: '/hardware/server-connectors/04_m2_socket.svg',
        alt: 'Supplied annotated M.2 socket example showing the card connector contacts, M-key position, and mounting standoff.',
        caption: 'M.2 socket / annotated M-key example for an NVMe SSD',
        width: 932, height: 326,
      }],
      overview: 'The M.2 socket mates with an SSD edge connector and carries the supported interface signals and motherboard DC supply.',
      problem: 'It gives a compact storage module a direct electrical attachment to the motherboard.',
      characteristicNote: 'This server map uses a PCIe/NVMe SSD. M.2 describes a form factor and connector system; supported protocols, keying, lanes, and module lengths depend on the board and drive.',
      characteristics: [
        { name: 'Keying', value: 'The connector key must match the module and its supported electrical interface.' },
        { name: 'Mounting', value: 'The module is retained at its mounting point; the supplied image identifies a screw standoff.' },
        { name: 'Data and power', value: 'The illustrated SSD uses PCIe carrying NVMe and receives DC through the socket, without a separate PSU cable.' },
      ],
      documentation: [{
        title: 'Kingston / M.2 SSD form factors, keying, and interface compatibility',
        url: 'https://www.kingston.com/en/ssd/ssd-faq',
      }, this.boardDocumentation],
    },
    'gpu-slot': {
      photos: [{
        src: '/hardware/server-connectors/05_pcie_x16_slot.svg',
        alt: 'Supplied annotated PCIe x16 slot example with callouts for contacts, the connector key, and a retention latch.',
        caption: 'GPU PCIe slot / annotated x16 connector example',
        width: 1044, height: 355,
      }],
      overview: 'A PCIe expansion slot mates with the graphics card edge connector and connects the card to the platform PCIe link.',
      problem: 'It provides a removable attachment for GPU communication and slot-supplied power.',
      characteristicNote: 'The supplied image shows an x16-size connector example. Physical slot length alone does not establish the number of electrically wired lanes or the negotiated PCIe generation.',
      characteristics: [
        { name: 'Contacts and key', value: 'The keyed connector aligns the card with signal, power, and ground contacts.' },
        { name: 'Retention', value: 'The illustrated latch helps retain the inserted card.' },
        { name: 'Power paths', value: 'The diagram separates motherboard slot power from the GPU auxiliary PSU feed.' },
      ],
      documentation: [this.pcieDocumentation, this.boardDocumentation],
    },
    'sata-ports': {
      photos: [{
        src: '/hardware/server-connectors/06_sata_ports.svg',
        alt: 'Supplied annotated motherboard SATA ports showing the L-shaped key and contacts inside a data connector.',
        caption: 'SATA ports / annotated motherboard data connectors',
        width: 991, height: 328,
      }],
      overview: 'Motherboard SATA ports attach compatible storage drives to the platform SATA controller through data cables.',
      problem: 'They provide a keyed physical connection for SATA storage traffic.',
      characteristicNote: 'The seven-pin SATA data connector carries two differential signal pairs and three grounds. Drive power uses a separate power connection.',
      characteristics: [
        { name: 'Connector', value: 'The standard data connector has seven contacts and an L-shaped key.' },
        { name: 'Main-map path', value: 'The illustrated HDD connects to native motherboard SATA; the M.2 NVMe SSD uses its separate PCIe attachment.' },
        { name: 'Power', value: 'The HDD receives its DC supply from the PSU. A standard SATA drive-power connector has fifteen contacts.' },
      ],
      documentation: [this.boardDocumentation, {
        title: 'Seagate / SATA drive interface, signal connector, and power connector',
        url: 'https://www.seagate.com/www-content/support-content/samsung/internal-products/spinpoint-m-series/en-us/docs/100772113c.pdf',
      }],
    },
    'nic-slot': {
      photos: [{
        src: '/hardware/server-connectors/07_pcie_x1_slot.svg',
        alt: 'Supplied annotated PCIe x1 slot example showing contacts inside the socket and the connector key.',
        caption: 'NIC PCIe slot / annotated x1 connector example',
        width: 954, height: 328,
      }],
      overview: 'The NIC PCIe slot connects an Ethernet adapter card to the platform PCIe interface and slot power.',
      problem: 'It gives a removable network adapter access to host communication and memory-transfer facilities.',
      characteristicNote: 'The supplied image is an x1 connector example. Network adapters can require other widths, such as x4 or x8; this generic map does not specify a NIC model or lane count.',
      characteristics: [
        { name: 'Attachment', value: 'The card edge mates with keyed slot contacts for PCIe signals, power, and ground.' },
        { name: 'Host traffic', value: 'Commands, status, and supported DMA transfers use PCIe. DMA is not a separate physical connector.' },
        { name: 'External network', value: 'The Ethernet cable attaches to the adapter network port, separately from this motherboard slot.' },
      ],
      documentation: [this.pcieDocumentation, this.boardDocumentation],
    },
  }

  public static get(regionId: string | null): HardwareElementInformation | null {
    if (regionId === null) return null
    return this.entries[regionId] ?? null
  }
}
