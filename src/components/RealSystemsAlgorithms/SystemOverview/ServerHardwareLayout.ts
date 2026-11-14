import { HardwareDiagram } from '../../../visualization/HardwareDiagram.ts'
import type { Scene, SceneBounds, ScenePath, SceneRegion } from '../../../visualization/Scene.ts'

export class ServerHardwareLayout {
  public static readonly width = 2000
  public static readonly height = 1440
  public static readonly chassis = { x: 0, y: 0, width: 1560, height: 1440 }
  public static readonly motherboard = { x: 45, y: 90, width: 970, height: 970 }
  public static readonly componentCount = 15
  public static readonly components = {
    cpu: { x: 90, y: 170, width: 420, height: 420 },
    ram: { x: 570, y: 170, width: 400, height: 200 },
    gpu: { x: 1030, y: 170, width: 420, height: 200 },
    'network-adapter': { x: 1030, y: 430, width: 420, height: 160 },
    bus: { x: 90, y: 660, width: 880, height: 80 },
    hdd: { x: 600, y: 1150, width: 380, height: 180 },
    ssd: { x: 1070, y: 1150, width: 380, height: 180 },
  } as const

  public static create(): Scene {
    const diagram = new HardwareDiagram(this.width, this.height)
    this.region(diagram, 'server-chassis', 'Server chassis / contains the motherboard, discrete expansion cards, power supply, and drive bays. Labeled cable connections extend outside the chassis. This illustrative single-socket server uses a separate PCH and BMC; integrated SoC and other server topologies differ', 'device', this.chassis, undefined, 'Server', 'neutral', 'system')
    this.region(diagram, 'motherboard', 'Motherboard / system board with socketed CPU and DIMMs, onboard PCH and BMC, firmware flash, USB ports, and a dedicated management network interface. Discrete GPU, host network, and optional storage-controller cards are drawn separately and attach through PCIe slots or risers', 'memory', this.motherboard, 'server-chassis', 'Motherboard', 'green', 'system')
    this.region(diagram, 'cpu', 'CPU / processor package installed in a motherboard socket. Its integrated memory controller connects directly to RAM; PCIe and a chipset link connect the processor to I/O. Expand this same block for the existing CPU map', 'cpu', this.components.cpu, 'motherboard', 'CPU', 'light-orange')
    this.region(diagram, 'ram', 'RAM / DIMMs installed in motherboard memory sockets, directly connected to the CPU memory controller rather than routed through the PCH', 'memory', this.components.ram, 'motherboard', 'RAM', 'light-blue')
    this.region(diagram, 'gpu', 'GPU / discrete graphics expansion card, physically separate from the motherboard PCB and connected through a PCIe slot or riser. Integrated GPUs are another arrangement', 'device', this.components.gpu, 'server-chassis', 'GPU / discrete card', 'light-orange')
    this.region(diagram, 'network-adapter', 'Network Adapter / host data-network expansion card connected through PCIe in this example. Onboard NICs are another arrangement. This card is separate from the dedicated BMC management interface', 'device', this.components['network-adapter'], 'server-chassis', 'Network Adapter', 'light-blue')
    this.region(diagram, 'chipset-pch', 'Chipset / Platform Controller Hub (PCH) / provides platform I/O such as USB and SPI flash access, linked to the CPU through a chipset uplink. A separate PCH is platform-dependent; some server SoCs integrate these functions', 'device', { x: 570, y: 430, width: 400, height: 160 }, 'motherboard', 'Chipset / PCH', 'lavender')
    this.region(diagram, 'bus', 'PCIe / I/O Interconnect / logical grouping of CPU host-I/O links and the PCH uplink. PCIe connects expansion cards and the local NVMe SSD example. The CPU to RAM DDR memory channel is a separate connection, not part of this I/O group', 'interconnect', this.components.bus, 'motherboard', 'PCIe / I/O Interconnect', 'lavender')
    this.region(diagram, 'firmware-flash', 'SPI flash memory / nonvolatile motherboard storage holding the host BIOS/UEFI firmware image. Host firmware is distinct from the BMC firmware', 'memory', { x: 90, y: 840, width: 300, height: 140 }, 'motherboard', 'SPI flash', 'light-blue')
    this.region(diagram, 'bios-uefi', 'BIOS / UEFI / host boot firmware stored in the SPI flash and executed by the CPU to initialize the platform and start an operating system. Firmware is software, not another processor', 'device', { x: 110, y: 900, width: 260, height: 60 }, 'firmware-flash', 'BIOS / UEFI', 'neutral')
    this.region(diagram, 'bmc', 'BMC / Baseboard Management Controller / independent management processor on the motherboard, with its own firmware and standby power. IPMI is a management interface/protocol implemented by the BMC, not a separate chip. Its network traffic reaches Management LAN through the dedicated management NIC/PHY shown beside it; shared host-NIC arrangements are another platform option', 'device', { x: 440, y: 840, width: 260, height: 140 }, 'motherboard', 'BMC / IPMI', 'light-orange')
    this.region(diagram, 'raid-hba', 'Optional RAID / HBA Controller / separate PCIe storage-controller card in this example. A RAID controller can manage arrays; an HBA exposes drives without implying hardware RAID. Its SAS/SATA links serve the HDD and SATA/SAS SSD example. The local NVMe SSD example bypasses this SAS/SATA controller and attaches directly through PCIe; NVMe-capable RAID variants are not modeled', 'device', { x: 1030, y: 840, width: 420, height: 140 }, 'server-chassis', 'RAID / HBA (optional)', 'light-orange')
    this.region(diagram, 'host-usb-ports', 'USB ports / independent host peripheral connectors backed by the PCH USB controller. Management LAN is a separate Ethernet function, not part of USB', 'interconnect', { x: 740, y: 820, width: 230, height: 70 }, 'motherboard', 'USB ports', 'light-blue')
    this.region(diagram, 'management-lan-port', 'Management NIC / LAN / dedicated management Ethernet network interface, PHY, and port serving the BMC. This independent Ethernet block is separate from USB and the host network card. Shared-NIC management is an alternative arrangement, not an additional serial stage', 'interconnect', { x: 740, y: 930, width: 230, height: 90 }, 'motherboard', 'Management NIC / LAN', 'light-blue')
    this.region(diagram, 'psu', 'Power Supply (PSU) / chassis-mounted AC-to-DC supply. Power distribution, motherboard voltage regulators, redundant supplies, and cables are abstracted. Dashed amber paths show power, including standby power for the BMC; they are not data links', 'device', { x: 90, y: 1150, width: 420, height: 180 }, 'server-chassis', 'Power Supply (PSU)', 'light-orange')
    this.region(diagram, 'hdd', 'HDD / magnetic drive in a chassis drive bay, outside the motherboard. The shown SAS/SATA data path uses the optional RAID/HBA controller and an abstracted backplane or cable', 'device', this.components.hdd, 'server-chassis', 'HDD', 'neutral')
    this.region(diagram, 'ssd', 'SSD / two separate interface examples in chassis drive bays: NVMe attaches directly to PCIe host I/O, while a SATA/SAS SSD connects through the optional SAS/SATA RAID/HBA card. These are alternative endpoint types, not two simultaneous host interfaces on one drive', 'device', this.components.ssd, 'server-chassis', 'SSD interfaces', 'neutral')
    this.region(diagram, 'ssd-nvme', 'NVMe SSD example / local PCIe connection directly to host I/O, bypassing the depicted SAS/SATA RAID/HBA. PCIe switches, NVMe-capable RAID, and other storage topologies can also exist', 'device', { x: 1090, y: 1210, width: 160, height: 100 }, 'ssd', 'NVMe', 'light-blue')
    this.region(diagram, 'ssd-sata-sas', 'SATA / SAS SSD example / connects through the depicted optional RAID/HBA controller and storage backplane or cables', 'device', { x: 1270, y: 1210, width: 160, height: 100 }, 'ssd', 'SATA / SAS', 'light-orange')
    this.connect(diagram)
    this.connectExternal(diagram)
    return { kind: 'system-overview', width: this.width, height: this.height, nodes: [], edges: [], regions: diagram.regions, paths: diagram.paths, count: this.componentCount, countLabel: 'server component groups', focusId: null }
  }

  private static region(diagram: HardwareDiagram, id: string, label: string, role: SceneRegion['role'], bounds: SceneBounds, parent: string | undefined, title: string, color: SceneRegion['color'], level: SceneRegion['level'] = 'component'): void {
    diagram.regions.push({ id, label, shortLabel: title, role, ...bounds, parentId: parent, color, level })
  }

  private static connect(diagram: HardwareDiagram): void {
    const data: readonly [string, string, string, ScenePath['caption']?][] = [
      ['cpu-ram', 'M510 270H570', 'DDR memory channels / CPU integrated memory controller directly to RAM, separate from PCIe / I/O', { text: 'DDR', x: 515, y: 248 }],
      ['cpu-bus', 'M300 590V660', 'CPU host I/O / PCIe and chipset-uplink context'],
      ['gpu-bus', 'M1030 270H1000V630H920V660', 'Discrete GPU expansion card / motherboard PCIe slot or riser to CPU host I/O'],
      ['adapter-bus', 'M1030 510H1020V620H800V660', 'Host Network Adapter expansion card / PCIe data path'],
      ['pch-bus', 'M770 590V660', 'PCH / chipset uplink to the CPU through the logical host-I/O group'],
      ['raid-bus', 'M1030 910H1000V780H900V740', 'Optional RAID/HBA card / PCIe host connection'],
      ['raid-hdd', 'M1130 980V1110H790V1150', 'SAS/SATA HDD data / controller through abstracted backplane or cable'],
      ['raid-ssd', 'M1350 980V1210', 'SATA/SAS SSD data / optional SAS/SATA RAID/HBA card to the SATA/SAS example only'],
      ['nvme-ssd', 'M970 710H1020V1100H1170V1210', 'Local NVMe SSD / direct PCIe attachment to CPU host I/O, bypassing the SAS/SATA RAID/HBA', { text: 'PCIe', x: 1040, y: 1078 }],
      ['pch-usb', 'M970 520H990V800H720V855H740', 'Host USB / PCH USB controller to independent USB connectors'],
      ['bmc-management-lan', 'M700 940H720V975H740', 'Out-of-band Ethernet management / BMC to its dedicated management NIC/PHY and LAN port; shared host-NIC management is an alternative'],
      ['pch-firmware', 'M570 540H530V620H65V820H240V840', 'Host boot-firmware access / PCH SPI connection to BIOS/UEFI flash'],
    ]
    for (const [id, d, label, caption] of data) diagram.paths.push({ id, d, label, caption, directed: true, bidirectional: true, highlighted: false })
    diagram.paths.push({ id: 'pch-bmc', d: 'M970 560H980V790H570V840', label: 'Host/BMC management sideband / platform-specific eSPI/LPC or other management connection; not bulk disk or network payload traffic', directed: true, bidirectional: true, dashed: true, highlighted: false })
    const power: readonly [string, string, string][] = [
      ['psu-motherboard', 'M90 1240H25V190H45', 'Power / PSU DC output to motherboard power distribution and regulators'],
      ['psu-bmc-standby', 'M300 1150V1100H590V980', 'Standby power / PSU standby rail powers the BMC through motherboard distribution while main host power is off'],
      ['psu-hdd', 'M300 1330V1380H790V1330', 'Drive power / PSU distribution to the HDD bay'],
      ['psu-ssd', 'M300 1330V1400H1260V1330', 'Drive power / PSU distribution to the SSD bay'],
    ]
    for (const [id, d, label] of power) diagram.paths.push({ id, d, label, directed: true, dashed: true, stroke: '#b58a45', highlighted: false })
  }

  private static connectExternal(diagram: HardwareDiagram): void {
    const connections: readonly [string, string, string, string, number, boolean][] = [
      ['external-display', 'M1450 270H1950', 'HDMI / DisplayPort', 'GPU display output to an external monitor / available outputs depend on the graphics card; display signals originate in its display engine', 248, false],
      ['external-lan', 'M1450 510H1950', 'LAN / Ethernet', 'Host Network Adapter to the external data network / separate from the dedicated BMC management network', 488, true],
      ['external-usb', 'M970 855H1010V810H1530V855H1950', 'USB', 'Independent host USB connectors to external peripherals; management Ethernet is a separate block and path', 833, true],
      ['external-management-lan', 'M970 975H1010V1030H1540V975H1950', 'Management LAN', 'Dedicated BMC management NIC/PHY and Ethernet port to an external management network / IPMI and other supported management interfaces', 953, true],
    ]
    for (const [id, d, text, label, y, bidirectional] of connections) diagram.paths.push({
      id, d, label, directed: true, bidirectional, highlighted: false,
      caption: { text, x: 1600, y },
    })
    diagram.paths.push({
      id: 'external-ac-power', d: 'M1950 1240H1535V1120H540V1240H510',
      label: 'External AC power source to the PSU input / AC-to-DC conversion happens inside the PSU, before the internal DC and standby rails',
      directed: true, dashed: true, stroke: '#b58a45', highlighted: false,
      caption: { text: 'AC power', x: 1600, y: 1218 },
    })
  }
}
